package org.example.repository;

import org.example.entity.RecipeLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RecipeLike Entity Repository
 */
@Repository
public interface RecipeLikeRepository extends JpaRepository<RecipeLike, Long> {
    
    /**
     * 사용자와 레시피로 좋아요 조회
     */
    Optional<RecipeLike> findByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
    
    /**
     * 사용자가 특정 레시피에 좋아요를 눌렀는지 확인
     */
    boolean existsByUserUserIdAndRecipeRecipeId(Long userId, Long recipeId);
    
    /**
     * 레시피별 좋아요 개수
     */
    long countByRecipeRecipeId(Long recipeId);
    
    /**
     * 사용자별 좋아요한 레시피 목록
     */
    java.util.List<RecipeLike> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}

