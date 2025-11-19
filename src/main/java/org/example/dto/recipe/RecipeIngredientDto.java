package org.example.dto.recipe;

import jakarta.validation.constraints.NotBlank;

public class RecipeIngredientDto {

    @NotBlank
    private String ingredientName;

    @NotBlank
    private String quantity;

    public RecipeIngredientDto() {
    }

    public RecipeIngredientDto(String ingredientName, String quantity) {
        this.ingredientName = ingredientName;
        this.quantity = quantity;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
}

