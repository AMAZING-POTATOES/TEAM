package org.example.dto.recipe;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import java.util.Map;

/**
 * Gemini API 레시피 생성 응답 DTO
 */
public class GeminiRecipeResponse {

    private boolean success;
    private RecipeData recipe;
    private UsageStats usageStats;
    private ErrorInfo error;
    private List<FallbackSuggestion> fallbackSuggestions;

    public GeminiRecipeResponse() {
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public RecipeData getRecipe() {
        return recipe;
    }

    public void setRecipe(RecipeData recipe) {
        this.recipe = recipe;
    }

    public UsageStats getUsageStats() {
        return usageStats;
    }

    public void setUsageStats(UsageStats usageStats) {
        this.usageStats = usageStats;
    }

    public ErrorInfo getError() {
        return error;
    }

    public void setError(ErrorInfo error) {
        this.error = error;
    }

    public List<FallbackSuggestion> getFallbackSuggestions() {
        return fallbackSuggestions;
    }

    public void setFallbackSuggestions(List<FallbackSuggestion> fallbackSuggestions) {
        this.fallbackSuggestions = fallbackSuggestions;
    }

    /**
     * 레시피 데이터 내부 클래스
     */
    public static class RecipeData {
        @SerializedName("menu_name")
        private String menuName;

        @SerializedName("description")
        private String description;

        @SerializedName("estimated_cooking_time")
        private Integer estimatedCookingTime;

        @SerializedName("difficulty")
        private String difficulty;

        @SerializedName("serving_size")
        private Integer servingSize;

        @SerializedName("ingredients_used")
        private List<GeminiIngredientDto> ingredientsUsed;

        @SerializedName("additional_ingredients")
        private List<GeminiIngredientDto> additionalIngredients;

        @SerializedName("cooking_steps")
        private List<GeminiCookingStepDto> cookingSteps;

        @SerializedName("nutritional_info")
        private NutritionalInfo nutritionalInfo;

        @SerializedName("tips")
        private List<String> tips;

        @SerializedName("safety_warnings")
        private List<String> safetyWarnings;

        // Getters and Setters
        public String getMenuName() {
            return menuName;
        }

        public void setMenuName(String menuName) {
            this.menuName = menuName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getEstimatedCookingTime() {
            return estimatedCookingTime;
        }

        public void setEstimatedCookingTime(Integer estimatedCookingTime) {
            this.estimatedCookingTime = estimatedCookingTime;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public Integer getServingSize() {
            return servingSize;
        }

        public void setServingSize(Integer servingSize) {
            this.servingSize = servingSize;
        }

        public List<GeminiIngredientDto> getIngredientsUsed() {
            return ingredientsUsed;
        }

        public void setIngredientsUsed(List<GeminiIngredientDto> ingredientsUsed) {
            this.ingredientsUsed = ingredientsUsed;
        }

        public List<GeminiIngredientDto> getAdditionalIngredients() {
            return additionalIngredients;
        }

        public void setAdditionalIngredients(List<GeminiIngredientDto> additionalIngredients) {
            this.additionalIngredients = additionalIngredients;
        }

        public List<GeminiCookingStepDto> getCookingSteps() {
            return cookingSteps;
        }

        public void setCookingSteps(List<GeminiCookingStepDto> cookingSteps) {
            this.cookingSteps = cookingSteps;
        }

        public NutritionalInfo getNutritionalInfo() {
            return nutritionalInfo;
        }

        public void setNutritionalInfo(NutritionalInfo nutritionalInfo) {
            this.nutritionalInfo = nutritionalInfo;
        }

        public List<String> getTips() {
            return tips;
        }

        public void setTips(List<String> tips) {
            this.tips = tips;
        }

        public List<String> getSafetyWarnings() {
            return safetyWarnings;
        }

        public void setSafetyWarnings(List<String> safetyWarnings) {
            this.safetyWarnings = safetyWarnings;
        }
    }

    /**
     * 영양 정보 내부 클래스
     */
    public static class NutritionalInfo {
        @SerializedName("calories_per_serving")
        private Integer caloriesPerServing;

        @SerializedName("protein")
        private String protein;

        @SerializedName("carbohydrates")
        private String carbohydrates;

        @SerializedName("fat")
        private String fat;

        public Integer getCaloriesPerServing() {
            return caloriesPerServing;
        }

        public void setCaloriesPerServing(Integer caloriesPerServing) {
            this.caloriesPerServing = caloriesPerServing;
        }

        public String getProtein() {
            return protein;
        }

        public void setProtein(String protein) {
            this.protein = protein;
        }

        public String getCarbohydrates() {
            return carbohydrates;
        }

        public void setCarbohydrates(String carbohydrates) {
            this.carbohydrates = carbohydrates;
        }

        public String getFat() {
            return fat;
        }

        public void setFat(String fat) {
            this.fat = fat;
        }
    }

    /**
     * 사용 통계 내부 클래스
     */
    public static class UsageStats {
        @SerializedName("priority_ingredients_used")
        private Integer priorityIngredientsUsed;

        @SerializedName("total_ingredients_available")
        private Integer totalIngredientsAvailable;

        @SerializedName("waste_reduction_score")
        private Integer wasteReductionScore;

        public Integer getPriorityIngredientsUsed() {
            return priorityIngredientsUsed;
        }

        public void setPriorityIngredientsUsed(Integer priorityIngredientsUsed) {
            this.priorityIngredientsUsed = priorityIngredientsUsed;
        }

        public Integer getTotalIngredientsAvailable() {
            return totalIngredientsAvailable;
        }

        public void setTotalIngredientsAvailable(Integer totalIngredientsAvailable) {
            this.totalIngredientsAvailable = totalIngredientsAvailable;
        }

        public Integer getWasteReductionScore() {
            return wasteReductionScore;
        }

        public void setWasteReductionScore(Integer wasteReductionScore) {
            this.wasteReductionScore = wasteReductionScore;
        }
    }

    /**
     * 에러 정보 내부 클래스
     */
    public static class ErrorInfo {
        private String code;
        private String message;
        private String details;

        public ErrorInfo() {
        }

        public ErrorInfo(String code, String message, String details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }

    /**
     * Fallback 제안 내부 클래스
     */
    public static class FallbackSuggestion {
        private String menuName;
        private String reason;
        private List<String> ingredients;

        public String getMenuName() {
            return menuName;
        }

        public void setMenuName(String menuName) {
            this.menuName = menuName;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public List<String> getIngredients() {
            return ingredients;
        }

        public void setIngredients(List<String> ingredients) {
            this.ingredients = ingredients;
        }
    }
}
