package com.urlshortener.repository;

import com.urlshortener.model.ClickAnalytics;
import com.urlshortener.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {

    // Daily click counts for a URL (last 30 days)
    @Query(value = """
        SELECT TO_CHAR(clicked_at, 'YYYY-MM-DD') as date, COUNT(*) as clicks
        FROM click_analytics
        WHERE url_id = :urlId
        AND clicked_at >= NOW() - INTERVAL '30 days'
        GROUP BY TO_CHAR(clicked_at, 'YYYY-MM-DD')
        ORDER BY date
        """, nativeQuery = true)
    List<Object[]> findDailyClicksByUrlId(@Param("urlId") Long urlId);

    // Device breakdown
    @Query(value = """
        SELECT device_type, COUNT(*) as count
        FROM click_analytics
        WHERE url_id = :urlId
        GROUP BY device_type
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> findDeviceBreakdownByUrlId(@Param("urlId") Long urlId);

    Long countByUrl(Url url);
}
