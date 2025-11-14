package org.example.repository;

import org.example.entity.RecipeComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RecipeComment Entity Repository
 */
@Repository
public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Long> {
    
    /**
     * 레시피별 댓글 목록 조회 (최신순)
     */
    Page<RecipeComment> findByRecipeRecipeIdOrderByCreatedAtDesc(Long recipeId, Pageable pageable);
    
    /**
     * 사용자별 댓글 목록 조회
     */
    List<RecipeComment> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * 레시피별 댓글 개수
     */
    long countByRecipeRecipeId(Long recipeId);
}

