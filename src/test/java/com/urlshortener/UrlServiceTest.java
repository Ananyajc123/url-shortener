package com.urlshortener;

import com.urlshortener.dto.*;
import com.urlshortener.exception.*;
import com.urlshortener.model.*;
import com.urlshortener.repository.*;
import com.urlshortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlServiceTest {

    @Mock private UrlRepository urlRepository;
    @Mock private UserRepository userRepository;
    @Mock private ClickAnalyticsRepository analyticsRepository;
    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;

    @InjectMocks private UrlService urlService;

    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(urlService, "baseUrl", "http://localhost:8080");
        ReflectionTestUtils.setField(urlService, "shortCodeLength", 7);
        ReflectionTestUtils.setField(urlService, "cacheTtlSeconds", 3600L);

        testUser = new User();
        testUser.setEmail("test@test.com");
        testUser.setName("Test User");

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void shouldShortenUrl_successfully() {
        ShortenRequest request = new ShortenRequest();
        request.setOriginalUrl("https://www.google.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(urlRepository.existsByShortCode(anyString())).thenReturn(false);
        when(urlRepository.save(any(Url.class))).thenAnswer(inv -> {
            Url u = inv.getArgument(0);
            ReflectionTestUtils.setField(u, "createdAt", java.time.LocalDateTime.now());
            return u;
        });

        ShortenResponse response = urlService.shortenUrl(request, "test@test.com");

        assertNotNull(response.getShortCode());
        assertEquals("https://www.google.com", response.getOriginalUrl());
        assertTrue(response.getShortUrl().contains(response.getShortCode()));
    }

    @Test
    void shouldThrow_whenCustomAliasAlreadyExists() {
        ShortenRequest request = new ShortenRequest();
        request.setOriginalUrl("https://google.com");
        request.setCustomAlias("mygoogle");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(urlRepository.existsByCustomAlias("mygoogle")).thenReturn(true);

        assertThrows(AliasAlreadyExistsException.class,
                () -> urlService.shortenUrl(request, "test@test.com"));
    }

    @Test
    void shouldResolveUrl_fromCache() {
        when(valueOperations.get("url:abc1234")).thenReturn("https://www.google.com");

        String result = urlService.resolveUrl("abc1234",
                mock(jakarta.servlet.http.HttpServletRequest.class));

        assertEquals("https://www.google.com", result);
        verify(urlRepository, never()).findByShortCode(any());
    }

    @Test
    void shouldResolveUrl_fromDatabase_onCacheMiss() {
        Url url = new Url();
        url.setShortCode("abc1234");
        url.setOriginalUrl("https://www.google.com");
        url.setIsActive(true);

        when(valueOperations.get("url:abc1234")).thenReturn(null);
        when(urlRepository.findByShortCode("abc1234")).thenReturn(Optional.of(url));

        String result = urlService.resolveUrl("abc1234",
                mock(jakarta.servlet.http.HttpServletRequest.class));

        assertEquals("https://www.google.com", result);
        verify(urlRepository).findByShortCode("abc1234");
    }

    @Test
    void shouldThrow_whenUrlNotFound() {
        when(valueOperations.get(anyString())).thenReturn(null);
        when(urlRepository.findByShortCode("notexist")).thenReturn(Optional.empty());

        assertThrows(UrlNotFoundException.class,
                () -> urlService.resolveUrl("notexist",
                        mock(jakarta.servlet.http.HttpServletRequest.class)));
    }
}
