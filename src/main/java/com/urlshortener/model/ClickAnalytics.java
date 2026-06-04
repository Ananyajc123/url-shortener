package com.urlshortener.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name = "click_analytics")
public class ClickAnalytics {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "url_id", nullable = false) private Url url;
    @Column(length = 45) private String ipAddress;
    @Column(length = 512) private String userAgent;
    @Column(length = 512) private String referer;
    @Column(length = 50) private String deviceType;
    private LocalDateTime clickedAt;
    @PrePersist protected void onCreate() { clickedAt = LocalDateTime.now(); }
    public ClickAnalytics() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Url getUrl() { return url; } public void setUrl(Url url) { this.url = url; }
    public String getIpAddress() { return ipAddress; } public void setIpAddress(String v) { this.ipAddress = v; }
    public String getUserAgent() { return userAgent; } public void setUserAgent(String v) { this.userAgent = v; }
    public String getReferer() { return referer; } public void setReferer(String v) { this.referer = v; }
    public String getDeviceType() { return deviceType; } public void setDeviceType(String v) { this.deviceType = v; }
    public LocalDateTime getClickedAt() { return clickedAt; }
    public static ClickAnalyticsBuilder builder() { return new ClickAnalyticsBuilder(); }
    public static class ClickAnalyticsBuilder {
        private Url url; private String ipAddress, userAgent, referer, deviceType;
        public ClickAnalyticsBuilder url(Url v) { this.url = v; return this; }
        public ClickAnalyticsBuilder ipAddress(String v) { this.ipAddress = v; return this; }
        public ClickAnalyticsBuilder userAgent(String v) { this.userAgent = v; return this; }
        public ClickAnalyticsBuilder referer(String v) { this.referer = v; return this; }
        public ClickAnalyticsBuilder deviceType(String v) { this.deviceType = v; return this; }
        public ClickAnalytics build() { ClickAnalytics c = new ClickAnalytics(); c.url = url; c.ipAddress = ipAddress; c.userAgent = userAgent; c.referer = referer; c.deviceType = deviceType; return c; }
    }
}
