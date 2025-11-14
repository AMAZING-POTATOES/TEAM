package org.example.repository;

import org.example.entity.RecipeRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RecipeRating Entity Repository
 */
@Repository
public interface RecipeRatingRepository extends JpaRepository<RecipeRating, Long> {
    
    /**
     * 사용자와 레시피로 별점 조회
     */
    Optional<RecipeRating> findByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
    
    /**
     * 레시피별 별점 목록 조회
     */
    java.util.List<RecipeRating> findByRecipeRecipeId(Long recipeId);
    
    /**
     * 레시피별 별점 개수
     */
    long countByRecipeRecipeId(Long recipeId);
    
    /**
     * 사용자가 특정 레시피에 별점을 남겼는지 확인
     */
    boolean existsByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
}

