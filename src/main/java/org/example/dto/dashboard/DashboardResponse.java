package org.example.dto.dashboard;

import org.example.dto.recipe.RecipeSummaryResponse;
import org.example.dto.refrigerator.ExpiringItemResponse;

import java.util.ArrayList;
import java.util.List;

public class DashboardResponse {

    private List<RecipeSummaryResponse> popularRecipes = new ArrayList<>();
    private List<RecipeSummaryResponse> recommendedRecipes = new ArrayList<>();
    private List<RecipeSummaryResponse> savedRecipes = new ArrayList<>();
    private List<ExpiringItemResponse> expiringItems = new ArrayList<>();
    private long refrigeratorItemCount;

    public List<RecipeSummaryResponse> getPopularRecipes() {
        return popularRecipes;
    }

    public void setPopularRecipes(List<RecipeSummaryResponse> popularRecipes) {
        this.popularRecipes = popularRecipes;
    }

    public List<RecipeSummaryResponse> getRecommendedRecipes() {
        return recommendedRecipes;
    }

    public void setRecommendedRecipes(List<RecipeSummaryResponse> recommendedRecipes) {
        this.recommendedRecipes = recommendedRecipes;
    }

    public List<RecipeSummaryResponse> getSavedRecipes() {
        return savedRecipes;
    }

    public void setSavedRecipes(List<RecipeSummaryResponse> savedRecipes) {
        this.savedRecipes = savedRecipes;
    }

    public List<ExpiringItemResponse> getExpiringItems() {
        return expiringItems;
    }

    public void setExpiringItems(List<ExpiringItemResponse> expiringItems) {
        this.expiringItems = expiringItems;
    }

    public long getRefrigeratorItemCount() {
        return refrigeratorItemCount;
    }

    public void setRefrigeratorItemCount(long refrigeratorItemCount) {
        this.refrigeratorItemCount = refrigeratorItemCount;
    }
}

