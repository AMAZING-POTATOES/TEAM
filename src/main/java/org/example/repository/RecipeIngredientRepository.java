package org.example.repository;

import org.example.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RecipeIngredient Entity Repository
 */
@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    
    /**
     * 레시피별 재료 목록 조회
     */
    List<RecipeIngredient> findByRecipeRecipeIdOrderByRecipeIngredientId(Long recipeId);
    
    /**
     * 재료명으로 검색
     */
    List<RecipeIngredient> findByIngredientNameContaining(String ingredientName);
}

