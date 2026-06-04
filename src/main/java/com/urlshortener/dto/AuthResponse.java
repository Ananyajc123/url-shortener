package com.urlshortener.dto;
public class AuthResponse {
    private String token, email, name;
    public AuthResponse() {}
    public AuthResponse(String token, String email, String name) { this.token=token; this.email=email; this.name=name; }
    public String getToken() { return token; } public void setToken(String v) { this.token = v; }
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
}
