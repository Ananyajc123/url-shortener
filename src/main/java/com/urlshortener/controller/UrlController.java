package com.urlshortener.controller;

import com.urlshortener.dto.*;
import com.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/api/urls")
    public ResponseEntity<ShortenResponse> shortenUrl(
            @Valid @RequestBody ShortenRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(urlService.shortenUrl(request, userDetails.getUsername()));
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode,
            HttpServletRequest request) {
        String originalUrl = urlService.resolveUrl(shortCode, request);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl)).build();
    }

    @GetMapping("/api/urls")
    public ResponseEntity<List<ShortenResponse>> getUserUrls(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlService.getUserUrls(userDetails.getUsername()));
    }

    @GetMapping("/api/urls/{shortCode}/stats")
    public ResponseEntity<UrlStatsResponse> getStats(
            @PathVariable String shortCode,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlService.getStats(shortCode, userDetails.getUsername()));
    }

    @DeleteMapping("/api/urls/{shortCode}")
    public ResponseEntity<Void> deleteUrl(
            @PathVariable String shortCode,
            @AuthenticationPrincipal UserDetails userDetails) {
        urlService.deleteUrl(shortCode, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
