package org.example.repository;

import org.example.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Recipe Entity Repository
 */
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    
    /**
     * 사용자별 레시피 목록 조회
     */
    Page<Recipe> findByUserUserId(Long userId, Pageable pageable);
    
    /**
     * 카테고리별 레시피 조회
     */
    Page<Recipe> findByCategory(String category, Pageable pageable);
    
    /**
     * 인기 레시피 조회 (좋아요 수, 평균 별점, 조회수 기준)
     */
    @Query("SELECT r FROM Recipe r ORDER BY r.likeCount DESC, r.averageRating DESC, r.viewCount DESC")
    Page<Recipe> findPopularRecipes(Pageable pageable);
    
    /**
     * 최신 레시피 조회
     */
    Page<Recipe> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * 특정 재료를 포함한 레시피 검색
     */
    @Query("SELECT DISTINCT r FROM Recipe r " +
           "JOIN r.ingredients ri " +
           "WHERE ri.ingredientName LIKE %:ingredientName% " +
           "ORDER BY r.averageRating DESC")
    List<Recipe> findByIngredientNameContaining(@Param("ingredientName") String ingredientName);
    
    /**
     * 제목 또는 설명으로 레시피 검색
     */
    @Query("SELECT r FROM Recipe r WHERE r.title LIKE %:keyword% OR r.description LIKE %:keyword%")
    Page<Recipe> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * 태그로 레시피 검색
     */
    @Query("SELECT DISTINCT r FROM Recipe r " +
           "JOIN r.tags rt " +
           "WHERE rt.tagName = :tagName")
    Page<Recipe> findByTagName(@Param("tagName") String tagName, Pageable pageable);
}

