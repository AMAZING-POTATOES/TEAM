package org.example.dto.recipe;

import java.util.List;
import java.util.Map;

/**
 * Gemini API 레시피 생성 요청 DTO
 */
public class GeminiRecipeRequest {

    private List<GeminiIngredientDto> ingredients;
    private Map<String, Object> userPreferences;
    private String additionalRequirements;

    public GeminiRecipeRequest() {
    }

    public GeminiRecipeRequest(List<GeminiIngredientDto> ingredients,
                               Map<String, Object> userPreferences,
                               String additionalRequirements) {
        this.ingredients = ingredients;
        this.userPreferences = userPreferences;
        this.additionalRequirements = additionalRequirements;
    }

    // Getters and Setters
    public List<GeminiIngredientDto> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<GeminiIngredientDto> ingredients) {
        this.ingredients = ingredients;
    }

    public Map<String, Object> getUserPreferences() {
        return userPreferences;
    }

    public void setUserPreferences(Map<String, Object> userPreferences) {
        this.userPreferences = userPreferences;
    }

    public String getAdditionalRequirements() {
        return additionalRequirements;
    }

    public void setAdditionalRequirements(String additionalRequirements) {
        this.additionalRequirements = additionalRequirements;
    }
}
