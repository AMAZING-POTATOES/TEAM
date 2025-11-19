package org.example.dto.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.entity.enums.Difficulty;

import java.util.ArrayList;
import java.util.List;

public class RecipeCreateRequest {

    @NotBlank
    private String title;

    private String description;

    private String mainImageUrl;

    @NotNull
    private Difficulty difficulty;

    @NotNull
    @Min(1)
    private Integer cookingTime;

    @Min(1)
    private Integer servings;

    @NotBlank
    private String category;

    @Valid
    @Size(min = 1)
    private List<RecipeIngredientDto> ingredients = new ArrayList<>();

    @Valid
    @Size(min = 1)
    private List<RecipeStepDto> steps = new ArrayList<>();

    @Valid
    private List<RecipeTagDto> tags = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

