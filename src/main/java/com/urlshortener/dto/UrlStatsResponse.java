package com.urlshortener.dto;
import java.time.LocalDateTime;
import java.util.List;
public class UrlStatsResponse {
    private String shortCode, originalUrl, shortUrl;
    private Long totalClicks;
    private LocalDateTime createdAt, expiresAt;
    private List<DailyClickDTO> dailyClicks;
    private List<DeviceBreakdownDTO> deviceBreakdown;
    public UrlStatsResponse() {}
    public String getShortCode() { return shortCode; } public void setShortCode(String v) { this.shortCode = v; }
    public String getOriginalUrl() { return originalUrl; } public void setOriginalUrl(String v) { this.originalUrl = v; }
    public String getShortUrl() { return shortUrl; } public void setShortUrl(String v) { this.shortUrl = v; }
    public Long getTotalClicks() { return totalClicks; } public void setTotalClicks(Long v) { this.totalClicks = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getExpiresAt() { return expiresAt; } public void setExpiresAt(LocalDateTime v) { this.expiresAt = v; }
    public List<DailyClickDTO> getDailyClicks() { return dailyClicks; } public void setDailyClicks(List<DailyClickDTO> v) { this.dailyClicks = v; }
    public List<DeviceBreakdownDTO> getDeviceBreakdown() { return deviceBreakdown; } public void setDeviceBreakdown(List<DeviceBreakdownDTO> v) { this.deviceBreakdown = v; }
}
