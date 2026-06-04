package com.urlshortener.dto;
public class DailyClickDTO {
    private String date; private Long clicks;
    public DailyClickDTO() {}
    public DailyClickDTO(String date, Long clicks) { this.date=date; this.clicks=clicks; }
    public String getDate() { return date; } public void setDate(String v) { this.date = v; }
    public Long getClicks() { return clicks; } public void setClicks(Long v) { this.clicks = v; }
}
