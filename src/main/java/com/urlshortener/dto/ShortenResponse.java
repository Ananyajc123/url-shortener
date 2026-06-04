package com.urlshortener.dto;
import java.time.LocalDateTime;
public class ShortenResponse {
    private String shortUrl, shortCode, originalUrl;
    private LocalDateTime expiresAt, createdAt;
    public ShortenResponse() {}
    public ShortenResponse(String shortUrl, String shortCode, String originalUrl, LocalDateTime expiresAt, LocalDateTime createdAt) { this.shortUrl=shortUrl; this.shortCode=shortCode; this.originalUrl=originalUrl; this.expiresAt=expiresAt; this.createdAt=createdAt; }
    public String getShortUrl() { return shortUrl; } public void setShortUrl(String v) { this.shortUrl = v; }
    public String getShortCode() { return shortCode; } public void setShortCode(String v) { this.shortCode = v; }
    public String getOriginalUrl() { return originalUrl; } public void setOriginalUrl(String v) { this.originalUrl = v; }
    public LocalDateTime getExpiresAt() { return expiresAt; } public void setExpiresAt(LocalDateTime v) { this.expiresAt = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
