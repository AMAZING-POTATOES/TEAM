package org.example.repository;

import org.example.entity.RefrigeratorItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * RefrigeratorItem Entity Repository
 */
@Repository
public interface RefrigeratorItemRepository extends JpaRepository<RefrigeratorItem, Long> {
    
    /**
     * 사용자별 재료 목록 조회
     */
    List<RefrigeratorItem> findByUserUserIdOrderByExpirationDateAsc(Long userId);
    
    /**
     * 사용자별 만료 예정 재료 조회 (3일 내)
     */
    @Query("SELECT r FROM RefrigeratorItem r WHERE r.user.userId = :userId " +
           "AND r.expirationDate BETWEEN :today AND :threeDaysLater " +
           "ORDER BY r.expirationDate ASC")
    List<RefrigeratorItem> findExpiringItemsByUserId(
            @Param("userId") Long userId,
            @Param("today") LocalDate today,
            @Param("threeDaysLater") LocalDate threeDaysLater
    );
    
    /**
     * 사용자별 재료 개수
     */
    long countByUserUserId(Long userId);
    
    /**
     * 사용자별 카테고리별 재료 조회
     */
    List<RefrigeratorItem> findByUserUserIdAndCategory(Long userId, String category);
}

