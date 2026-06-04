package com.urlshortener.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
@Entity @Table(name = "urls", indexes = { @Index(name = "idx_short_code", columnList = "shortCode"), @Index(name = "idx_user_id", columnList = "user_id") })
public class Url {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 2048) private String originalUrl;
    @Column(nullable = false, unique = true, length = 20) private String shortCode;
    @Column(length = 100) private String customAlias;
    private Long clickCount = 0L;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private Boolean isActive = true;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<ClickAnalytics> analytics;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    public boolean isExpired() { return expiresAt != null && LocalDateTime.now().isAfter(expiresAt); }
    public Url() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getOriginalUrl() { return originalUrl; } public void setOriginalUrl(String v) { this.originalUrl = v; }
    public String getShortCode() { return shortCode; } public void setShortCode(String v) { this.shortCode = v; }
    public String getCustomAlias() { return customAlias; } public void setCustomAlias(String v) { this.customAlias = v; }
    public Long getClickCount() { return clickCount; } public void setClickCount(Long v) { this.clickCount = v; }
    public LocalDateTime getExpiresAt() { return expiresAt; } public void setExpiresAt(LocalDateTime v) { this.expiresAt = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public Boolean getIsActive() { return isActive; } public void setIsActive(Boolean v) { this.isActive = v; }
    public User getUser() { return user; } public void setUser(User user) { this.user = user; }
    public static UrlBuilder builder() { return new UrlBuilder(); }
    public static class UrlBuilder {
        private String originalUrl, shortCode, customAlias; private LocalDateTime expiresAt; private User user;
        public UrlBuilder originalUrl(String v) { this.originalUrl = v; return this; }
        public UrlBuilder shortCode(String v) { this.shortCode = v; return this; }
        public UrlBuilder customAlias(String v) { this.customAlias = v; return this; }
        public UrlBuilder expiresAt(LocalDateTime v) { this.expiresAt = v; return this; }
        public UrlBuilder user(User v) { this.user = v; return this; }
        public Url build() { Url u = new Url(); u.originalUrl = originalUrl; u.shortCode = shortCode; u.customAlias = customAlias; u.expiresAt = expiresAt; u.user = user; return u; }
    }
}
