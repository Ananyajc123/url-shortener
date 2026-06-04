package com.urlshortener.dto;
public class DeviceBreakdownDTO {
    private String deviceType; private Long count;
    public DeviceBreakdownDTO() {}
    public DeviceBreakdownDTO(String deviceType, Long count) { this.deviceType=deviceType; this.count=count; }
    public String getDeviceType() { return deviceType; } public void setDeviceType(String v) { this.deviceType = v; }
    public Long getCount() { return count; } public void setCount(Long v) { this.count = v; }
}
