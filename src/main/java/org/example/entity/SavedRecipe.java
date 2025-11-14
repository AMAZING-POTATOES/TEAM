package org.example.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 저장한 레시피 Entity
 * Saved_Recipes 테이블과 매핑
 */
@Entity
@Table(name = "saved_recipes", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_recipe_id", columnList = "recipe_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "unique_user_recipe", columnNames = {"user_id", "recipe_id"})
})
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saved_recipe_id")
    private Long savedRecipeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;

    // 기본 생성자
    public SavedRecipe() {
    }

    // 생성자
    public SavedRecipe(User user, Recipe recipe) {
        this.user = user;
        this.recipe = recipe;
    }

    // Getters and Setters
    public Long getSavedRecipeId() {
        return savedRecipeId;
    }

    public void setSavedRecipeId(Long savedRecipeId) {
        this.savedRecipeId = savedRecipeId;
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

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}

