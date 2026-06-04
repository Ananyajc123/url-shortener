package com.urlshortener.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data @AllArgsConstructor
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
