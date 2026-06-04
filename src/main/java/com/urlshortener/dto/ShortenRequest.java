package com.urlshortener.dto;
import jakarta.validation.constraints.*;
public class ShortenRequest {
    @NotBlank @Pattern(regexp="^(https?://).*", message="URL must start with http:// or https://") private String originalUrl;
    private String customAlias;
    private Integer expiryDays;
    public ShortenRequest() {}
    public String getOriginalUrl() { return originalUrl; } public void setOriginalUrl(String v) { this.originalUrl = v; }
    public String getCustomAlias() { return customAlias; } public void setCustomAlias(String v) { this.customAlias = v; }
    public Integer getExpiryDays() { return expiryDays; } public void setExpiryDays(Integer v) { this.expiryDays = v; }
}
