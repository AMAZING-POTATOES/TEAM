package org.example.dto.interaction;

public class RecipeSaveResponse {

    private Long recipeId;
    private boolean saved;
    private int saveCount;

    public RecipeSaveResponse() {
    }

    public RecipeSaveResponse(Long recipeId, boolean saved, int saveCount) {
        this.recipeId = recipeId;
        this.saved = saved;
        this.saveCount = saveCount;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public boolean isSaved() {
        return saved;
    }

    public void setSaved(boolean saved) {
        this.saved = saved;
    }

    public int getSaveCount() {
        return saveCount;
    }

    public void setSaveCount(int saveCount) {
        this.saveCount = saveCount;
    }
}

