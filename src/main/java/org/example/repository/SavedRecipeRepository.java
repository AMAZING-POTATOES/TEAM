package org.example.repository;

import org.example.entity.SavedRecipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * SavedRecipe Entity Repository
 */
@Repository
public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long> {
    
    /**
     * 사용자와 레시피로 저장 조회
     */
    Optional<SavedRecipe> findByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
    
    /**
     * 사용자가 특정 레시피를 저장했는지 확인
     */
    boolean existsByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
    
    /**
     * 사용자별 저장한 레시피 목록 조회 (최신순)
     */
    Page<SavedRecipe> findByUserUserIdOrderBySavedAtDesc(Long userId, Pageable pageable);
    
    /**
     * 레시피별 저장 횟수
     */
    long countByRecipeRecipeId(Long recipeId);
}

