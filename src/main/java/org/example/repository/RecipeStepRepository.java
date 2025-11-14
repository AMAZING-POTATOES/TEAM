package org.example.repository;

import org.example.entity.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RecipeStep Entity Repository
 */
@Repository
public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long> {
    
    /**
     * 레시피별 조리 단계 조회 (순서대로)
     */
    List<RecipeStep> findByRecipeRecipeIdOrderByStepNumberAsc(Long recipeId);
}

