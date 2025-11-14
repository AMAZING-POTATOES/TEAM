package org.example.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 레시피 좋아요 Entity
 * Recipe_Likes 테이블과 매핑
 */
@Entity
@Table(name = "recipe_likes", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_recipe_id", columnList = "recipe_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "unique_user_like", columnNames = {"user_id", "recipe_id"})
})
public class RecipeLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 기본 생성자
    public RecipeLike() {
    }

    // 생성자
    public RecipeLike(User user, Recipe recipe) {
        this.user = user;
        this.recipe = recipe;
    }

    // Getters and Setters
    public Long getLikeId() {
        return likeId;
    }

    public void setLikeId(Long likeId) {
        this.likeId = likeId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

