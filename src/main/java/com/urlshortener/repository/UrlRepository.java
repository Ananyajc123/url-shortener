package com.urlshortener.repository;

import com.urlshortener.model.Url;
import com.urlshortener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    Optional<Url> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    List<Url> findByUserOrderByCreatedAtDesc(User user);

    // Increment click count efficiently in DB
    @Modifying
    @Query("UPDATE Url u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :shortCode")
    void incrementClickCount(@Param("shortCode") String shortCode);

    // Find expired URLs for cleanup
    @Query("SELECT u FROM Url u WHERE u.expiresAt IS NOT NULL AND u.expiresAt < :now AND u.isActive = true")
    List<Url> findExpiredUrls(@Param("now") LocalDateTime now);

    // Deactivate expired URLs
    @Modifying
    @Query("UPDATE Url u SET u.isActive = false WHERE u.expiresAt IS NOT NULL AND u.expiresAt < :now")
    void deactivateExpiredUrls(@Param("now") LocalDateTime now);
}
