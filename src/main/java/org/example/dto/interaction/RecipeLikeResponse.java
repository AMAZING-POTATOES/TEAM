package org.example.dto.interaction;

public class RecipeLikeResponse {

    private Long recipeId;
    private boolean liked;
    private int likeCount;

    public RecipeLikeResponse() {
    }

    public RecipeLikeResponse(Long recipeId, boolean liked, int likeCount) {
        this.recipeId = recipeId;
        this.liked = liked;
        this.likeCount = likeCount;
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

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
}

