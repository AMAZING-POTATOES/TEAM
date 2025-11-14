package org.example.repository;

import org.example.entity.RecipeTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RecipeTag Entity Repository
 */
@Repository
public interface RecipeTagRepository extends JpaRepository<RecipeTag, Long> {
    
    /**
     * 레시피별 태그 목록 조회
     */
    List<RecipeTag> findByRecipeRecipeId(Long recipeId);
    
    /**
     * 태그명으로 레시피 검색
     */
    List<RecipeTag> findByTagName(String tagName);
}

