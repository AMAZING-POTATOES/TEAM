package org.example.controller;

import org.example.dto.dashboard.DashboardResponse;
import org.example.dto.recipe.RecipeSummaryResponse;
import org.example.dto.refrigerator.ExpiringItemResponse;
import org.example.security.JwtUserDetails;
import org.example.service.RecipeInteractionService;
import org.example.service.RecipeRecommendationService;
import org.example.service.RecipeService;
import org.example.service.RefrigeratorItemService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final RecipeService recipeService;
    private final RefrigeratorItemService refrigeratorItemService;
    private final RecipeRecommendationService recipeRecommendationService;
    private final RecipeInteractionService recipeInteractionService;

    public DashboardController(RecipeService recipeService,
                               RefrigeratorItemService refrigeratorItemService,
                               RecipeRecommendationService recipeRecommendationService,
                               RecipeInteractionService recipeInteractionService) {
        this.recipeService = recipeService;
        this.refrigeratorItemService = refrigeratorItemService;
        this.recipeRecommendationService = recipeRecommendationService;
        this.recipeInteractionService = recipeInteractionService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal JwtUserDetails currentUser) {
        DashboardResponse response = new DashboardResponse();

        response.setPopularRecipes(recipeService.getPopularRecipes(PageRequest.of(0, 5))
                .map(RecipeSummaryResponse::from)
                .getContent());

        response.setRecommendedRecipes(recipeRecommendationService
                .recommendRecipesByIngredients(currentUser.getUserId())
                .stream()
                .limit(5)
                .map(RecipeSummaryResponse::from)
                .collect(Collectors.toList()));

        response.setSavedRecipes(recipeInteractionService
                .getSavedRecipes(currentUser.getUserId(), PageRequest.of(0, 5))
                .map(saved -> RecipeSummaryResponse.from(saved.getRecipe()))
                .getContent());

        List<ExpiringItemResponse> expiring = refrigeratorItemService.getExpiringItems(currentUser.getUserId())
                .stream()
                .map(item -> new ExpiringItemResponse(item.getItemId(), item.getIngredientName(), item.getExpirationDate()))
                .collect(Collectors.toList());
        response.setExpiringItems(expiring);

        response.setRefrigeratorItemCount(refrigeratorItemService.getItemCount(currentUser.getUserId()));

        return ResponseEntity.ok(response);
    }
}

