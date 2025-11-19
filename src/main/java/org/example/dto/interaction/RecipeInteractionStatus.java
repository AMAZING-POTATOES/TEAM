package org.example.dto.interaction;

public class RecipeInteractionStatus {

    private Long recipeId;
    private boolean liked;
    private boolean saved;
    private Integer userRating;

    public RecipeInteractionStatus() {
    }

    public RecipeInteractionStatus(Long recipeId, boolean liked, boolean saved, Integer userRating) {
        this.recipeId = recipeId;
        this.liked = liked;
        this.saved = saved;
        this.userRating = userRating;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public boolean isSaved() {
        return saved;
    }

    public void setSaved(boolean saved) {
        this.saved = saved;
    }

    public Integer getUserRating() {
        return userRating;
    }

    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }
}

