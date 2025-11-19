package org.example.dto.recipe;

import org.example.entity.Recipe;
import org.example.entity.RecipeIngredient;
import org.example.entity.RecipeStep;
import org.example.entity.RecipeTag;

import java.util.List;
import java.util.stream.Collectors;

public class RecipeDetailResponse extends RecipeSummaryResponse {

    private String description;
    private String mainImageUrl;
    private List<RecipeIngredientDto> ingredients;
    private List<RecipeStepDto> steps;
    private List<RecipeTagDto> tags;

    public static RecipeDetailResponse from(Recipe recipe) {
        RecipeDetailResponse response = new RecipeDetailResponse();
        RecipeSummaryResponse summary = RecipeSummaryResponse.from(recipe);
        response.setRecipeId(summary.getRecipeId());
        response.setUserId(summary.getUserId());
        response.setTitle(summary.getTitle());
        response.setCategory(summary.getCategory());
        response.setDifficulty(summary.getDifficulty());
        response.setCookingTime(summary.getCookingTime());
        response.setServings(summary.getServings());
        response.setViewCount(summary.getViewCount());
        response.setLikeCount(summary.getLikeCount());
        response.setCommentCount(summary.getCommentCount());
        response.setSaveCount(summary.getSaveCount());
        response.setAverageRating(summary.getAverageRating());
        response.setIsAiGenerated(summary.getIsAiGenerated());
        response.setCreatedAt(summary.getCreatedAt());

        response.setDescription(recipe.getDescription());
        response.setMainImageUrl(recipe.getMainImageUrl());
        response.setIngredients(mapIngredients(recipe.getIngredients()));
        response.setSteps(mapSteps(recipe.getSteps()));
        response.setTags(mapTags(recipe.getTags()));
        return response;
    }

    private static List<RecipeIngredientDto> mapIngredients(List<RecipeIngredient> ingredients) {
        return ingredients.stream()
                .map(ingredient -> new RecipeIngredientDto(ingredient.getIngredientName(), ingredient.getQuantity()))
                .collect(Collectors.toList());
    }

    private static List<RecipeStepDto> mapSteps(List<RecipeStep> steps) {
        return steps.stream()
                .map(step -> new RecipeStepDto(step.getStepNumber(), step.getDescription()))
                .collect(Collectors.toList());
    }

    private static List<RecipeTagDto> mapTags(List<RecipeTag> tags) {
        return tags.stream()
                .map(tag -> new RecipeTagDto(tag.getTagName()))
                .collect(Collectors.toList());
    }

    // getters/setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public List<RecipeIngredientDto> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<RecipeIngredientDto> ingredients) {
        this.ingredients = ingredients;
    }

    public List<RecipeStepDto> getSteps() {
        return steps;
    }

    public void setSteps(List<RecipeStepDto> steps) {
        this.steps = steps;
    }

    public List<RecipeTagDto> getTags() {
        return tags;
    }

    public void setTags(List<RecipeTagDto> tags) {
        this.tags = tags;
    }
}

