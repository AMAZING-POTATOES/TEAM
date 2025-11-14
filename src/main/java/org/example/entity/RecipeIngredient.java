package org.example.entity;

import jakarta.persistence.*;

/**
 * 레시피 재료 Entity
 * Recipe_Ingredients 테이블과 매핑
 */
@Entity
@Table(name = "recipe_ingredients", indexes = {
    @Index(name = "idx_recipe_id", columnList = "recipe_id"),
    @Index(name = "idx_ingredient_name", columnList = "ingredient_name")
})
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_ingredient_id")
    private Long recipeIngredientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(name = "ingredient_name", nullable = false, length = 100)
    private String ingredientName;

    @Column(name = "quantity", nullable = false, length = 50)
    private String quantity;

    // 기본 생성자
    public RecipeIngredient() {
    }

    // 생성자
    public RecipeIngredient(Recipe recipe, String ingredientName, String quantity) {
        this.recipe = recipe;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getRecipeIngredientId() {
        return recipeIngredientId;
    }

    public void setRecipeIngredientId(Long recipeIngredientId) {
        this.recipeIngredientId = recipeIngredientId;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
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

