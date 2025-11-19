package org.example.dto.recipe;

import org.example.entity.Recipe;
import org.example.entity.enums.Difficulty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecipeSummaryResponse {

    private Long recipeId;
    private Long userId;
    private String title;
    private String category;
    private Difficulty difficulty;
    private Integer cookingTime;
    private Integer servings;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer saveCount;
    private BigDecimal averageRating;
    private Boolean isAiGenerated;
    private LocalDateTime createdAt;

    public static RecipeSummaryResponse from(Recipe recipe) {
        RecipeSummaryResponse response = new RecipeSummaryResponse();
        response.setRecipeId(recipe.getRecipeId());
        response.setUserId(recipe.getUser().getUserId());
        response.setTitle(recipe.getTitle());
        response.setCategory(recipe.getCategory());
        response.setDifficulty(recipe.getDifficulty());
        response.setCookingTime(recipe.getCookingTime());
        response.setServings(recipe.getServings());
        response.setViewCount(recipe.getViewCount());
        response.setLikeCount(recipe.getLikeCount());
        response.setCommentCount(recipe.getCommentCount());
        response.setSaveCount(recipe.getSaveCount());
        response.setAverageRating(recipe.getAverageRating());
        response.setIsAiGenerated(recipe.getIsAiGenerated());
        response.setCreatedAt(recipe.getCreatedAt());
        return response;
    }

    // getters/setters omitted for brevity (implement all)
    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getCookingTime() {
        return cookingTime;
    }

    public void setCookingTime(Integer cookingTime) {
        this.cookingTime = cookingTime;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public Integer getSaveCount() {
        return saveCount;
    }

    public void setSaveCount(Integer saveCount) {
        this.saveCount = saveCount;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Boolean getIsAiGenerated() {
        return isAiGenerated;
    }

    public void setIsAiGenerated(Boolean isAiGenerated) {
        this.isAiGenerated = isAiGenerated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

