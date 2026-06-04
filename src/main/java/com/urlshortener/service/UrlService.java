package com.urlshortener.service;

import com.urlshortener.dto.*;
import com.urlshortener.exception.*;
import com.urlshortener.model.*;
import com.urlshortener.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private static final Logger log = LoggerFactory.getLogger(UrlService.class);

    @Autowired private UrlRepository urlRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ClickAnalyticsRepository analyticsRepository;
    @Autowired private RedisTemplate<String, String> redisTemplate;

    @Value("${app.base-url}") private String baseUrl;
    @Value("${app.short-code-length}") private int shortCodeLength;
    @Value("${app.cache.ttl-seconds}") private long cacheTtlSeconds;

    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CACHE_PREFIX = "url:";

    @Transactional
    public ShortenResponse shortenUrl(ShortenRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            if (urlRepository.existsByCustomAlias(request.getCustomAlias()))
                throw new AliasAlreadyExistsException("Alias '" + request.getCustomAlias() + "' is already taken");
            shortCode = request.getCustomAlias();
        } else {
            shortCode = generateUniqueShortCode();
        }

        LocalDateTime expiresAt = null;
        if (request.getExpiryDays() != null && request.getExpiryDays() > 0)
            expiresAt = LocalDateTime.now().plusDays(request.getExpiryDays());

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .expiresAt(expiresAt)
                .user(user)
                .build();
        urlRepository.save(url);
        cacheUrl(shortCode, request.getOriginalUrl(), expiresAt);
        log.info("URL shortened: {} -> {}", request.getOriginalUrl(), shortCode);
        return new ShortenResponse(baseUrl + "/" + shortCode, shortCode, request.getOriginalUrl(), expiresAt, url.getCreatedAt());
    }

    @Transactional
    public String resolveUrl(String shortCode, HttpServletRequest request) {
        String cachedUrl = redisTemplate.opsForValue().get(CACHE_PREFIX + shortCode);
        if (cachedUrl != null) { trackClickAsync(shortCode, request); return cachedUrl; }
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found: " + shortCode));
        if (url.isExpired() || !url.getIsActive()) throw new UrlExpiredException("This URL has expired");
        cacheUrl(shortCode, url.getOriginalUrl(), url.getExpiresAt());
        trackClickAsync(shortCode, request);
        return url.getOriginalUrl();
    }

    @Transactional
    public void trackClickAsync(String shortCode, HttpServletRequest request) {
        try {
            Url url = urlRepository.findByShortCode(shortCode).orElse(null);
            if (url == null) return;
            urlRepository.incrementClickCount(shortCode);
            ClickAnalytics analytics = ClickAnalytics.builder()
                    .url(url).ipAddress(getClientIp(request))
                    .userAgent(request.getHeader("User-Agent"))
                    .referer(request.getHeader("Referer"))
                    .deviceType(detectDevice(request.getHeader("User-Agent")))
                    .build();
            analyticsRepository.save(analytics);
        } catch (Exception e) { log.error("Failed to track click: {}", e.getMessage()); }
    }

    public UrlStatsResponse getStats(String shortCode, String userEmail) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        List<Object[]> dailyData = analyticsRepository.findDailyClicksByUrlId(url.getId());
        List<DailyClickDTO> dailyClicks = dailyData.stream()
                .map(row -> new DailyClickDTO((String) row[0], (Long) row[1])).collect(Collectors.toList());
        List<Object[]> deviceData = analyticsRepository.findDeviceBreakdownByUrlId(url.getId());
        List<DeviceBreakdownDTO> deviceBreakdown = deviceData.stream()
                .map(row -> new DeviceBreakdownDTO((String) row[0], (Long) row[1])).collect(Collectors.toList());
        UrlStatsResponse stats = new UrlStatsResponse();
        stats.setShortCode(shortCode);
        stats.setOriginalUrl(url.getOriginalUrl());
        stats.setShortUrl(baseUrl + "/" + shortCode);
        stats.setTotalClicks(url.getClickCount());
        stats.setCreatedAt(url.getCreatedAt());
        stats.setExpiresAt(url.getExpiresAt());
        stats.setDailyClicks(dailyClicks);
        stats.setDeviceBreakdown(deviceBreakdown);
        return stats;
    }

    public List<ShortenResponse> getUserUrls(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return urlRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(url -> new ShortenResponse(baseUrl + "/" + url.getShortCode(), url.getShortCode(),
                        url.getOriginalUrl(), url.getExpiresAt(), url.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUrl(String shortCode, String userEmail) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        url.setIsActive(false);
        urlRepository.save(url);
        redisTemplate.delete(CACHE_PREFIX + shortCode);
        log.info("URL deleted: {}", shortCode);
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredUrls() {
        urlRepository.deactivateExpiredUrls(LocalDateTime.now());
        log.info("Expired URLs cleaned up");
    }

    private String generateUniqueShortCode() {
        String code; int attempts = 0;
        do { code = generateRandomCode(); if (++attempts > 10) throw new RuntimeException("Could not generate unique code"); }
        while (urlRepository.existsByShortCode(code));
        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder(shortCodeLength);
        for (int i = 0; i < shortCodeLength; i++) sb.append(BASE62.charAt(RANDOM.nextInt(BASE62.length())));
        return sb.toString();
    }

    private void cacheUrl(String shortCode, String originalUrl, LocalDateTime expiresAt) {
        if (expiresAt != null) {
            long seconds = java.time.Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
            if (seconds > 0) redisTemplate.opsForValue().set(CACHE_PREFIX + shortCode, originalUrl, seconds, TimeUnit.SECONDS);
        } else { redisTemplate.opsForValue().set(CACHE_PREFIX + shortCode, originalUrl, cacheTtlSeconds, TimeUnit.SECONDS); }
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isEmpty()) ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }

    private String detectDevice(String ua) {
        if (ua == null) return "Unknown";
        ua = ua.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) return "Mobile";
        if (ua.contains("tablet") || ua.contains("ipad")) return "Tablet";
        return "Desktop";
    }
}
