package org.example.controller;

import jakarta.validation.Valid;
import org.example.dto.interaction.RecipeInteractionStatus;
import org.example.dto.recipe.*;
import org.example.entity.RecipeRating;
import org.example.security.JwtUserDetails;
import org.example.service.RecipeInteractionService;
import org.example.service.RecipeRecommendationService;
import org.example.service.RecipeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeInteractionService recipeInteractionService;
    private final RecipeRecommendationService recipeRecommendationService;

    public RecipeController(RecipeService recipeService,
                            RecipeInteractionService recipeInteractionService,
                            RecipeRecommendationService recipeRecommendationService) {
        this.recipeService = recipeService;
        this.recipeInteractionService = recipeInteractionService;
        this.recipeRecommendationService = recipeRecommendationService;
    }

    @GetMapping
    public ResponseEntity<Page<RecipeSummaryResponse>> getRecipes(@RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getRecipes(pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<RecipeSummaryResponse>> getPopularRecipes(@RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getPopularRecipes(pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<RecipeSummaryResponse>> getUserRecipes(@PathVariable Long userId,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getRecipesByUserId(userId, pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<RecipeSummaryResponse>> getRecipesByCategory(@PathVariable String category,
                                                                            @RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getRecipesByCategory(category, pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/search/ingredient")
    public ResponseEntity<List<RecipeSummaryResponse>> searchByIngredient(@RequestParam String ingredient) {
        List<RecipeSummaryResponse> result = recipeService.searchRecipesByIngredient(ingredient).stream()
                .map(RecipeSummaryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<Page<RecipeSummaryResponse>> searchByKeyword(@RequestParam String keyword,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.searchRecipesByKeyword(keyword, pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/search/tag")
    public ResponseEntity<Page<RecipeSummaryResponse>> searchByTag(@RequestParam String tagName,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.searchRecipesByTag(tagName, pageable).map(RecipeSummaryResponse::from));
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailResponse> getRecipeDetail(@PathVariable Long recipeId) {
        RecipeDetailResponse response = recipeService.getRecipeDetail(recipeId)
                .map(RecipeDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<RecipeDetailResponse> createRecipe(@AuthenticationPrincipal JwtUserDetails currentUser,
                                                             @Valid @RequestBody RecipeCreateRequest request) {
        var recipe = recipeService.createRecipe(
                currentUser.getUserId(),
                request.getTitle(),
                request.getDescription(),
                request.getMainImageUrl(),
                request.getDifficulty(),
                request.getCookingTime(),
                request.getServings(),
                request.getCategory(),
                request.getIngredients().stream().map(RecipeIngredientDto::getIngredientName).collect(Collectors.toList()),
                request.getIngredients().stream().map(RecipeIngredientDto::getQuantity).collect(Collectors.toList()),
                request.getSteps().stream().map(RecipeStepDto::getDescription).collect(Collectors.toList()),
                request.getTags().stream().map(RecipeTagDto::getTagName).collect(Collectors.toList())
        );
        return ResponseEntity.ok(RecipeDetailResponse.from(recipe));
    }

    @PutMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailResponse> updateRecipe(@PathVariable Long recipeId,
                                                             @AuthenticationPrincipal JwtUserDetails currentUser,
                                                             @Valid @RequestBody RecipeUpdateRequest request) {
        var recipe = recipeService.updateRecipe(
                recipeId,
                currentUser.getUserId(),
                request.getTitle(),
                request.getDescription(),
                request.getMainImageUrl(),
                request.getDifficulty(),
                request.getCookingTime(),
                request.getServings(),
                request.getCategory(),
                request.getIngredients().stream().map(RecipeIngredientDto::getIngredientName).collect(Collectors.toList()),
                request.getIngredients().stream().map(RecipeIngredientDto::getQuantity).collect(Collectors.toList()),
                request.getSteps().stream().map(RecipeStepDto::getDescription).collect(Collectors.toList()),
                request.getTags().stream().map(RecipeTagDto::getTagName).collect(Collectors.toList())
        );
        return ResponseEntity.ok(RecipeDetailResponse.from(recipe));
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long recipeId,
                                             @AuthenticationPrincipal JwtUserDetails currentUser) {
        recipeService.deleteRecipe(recipeId, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{recipeId}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long recipeId) {
        recipeService.incrementViewCount(recipeId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{recipeId}/interaction")
    public ResponseEntity<RecipeInteractionStatus> getInteractionStatus(@PathVariable Long recipeId,
                                                                        @AuthenticationPrincipal JwtUserDetails currentUser) {
        boolean liked = recipeInteractionService.isLiked(recipeId, currentUser.getUserId());
        boolean saved = recipeInteractionService.isSaved(recipeId, currentUser.getUserId());
        Integer rating = recipeInteractionService.getUserRating(recipeId, currentUser.getUserId())
                .map(RecipeRating::getRating)
                .orElse(null);
        return ResponseEntity.ok(new RecipeInteractionStatus(recipeId, liked, saved, rating));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecipeSummaryResponse>> recommendByRefrigerator(@AuthenticationPrincipal JwtUserDetails currentUser) {
        List<RecipeSummaryResponse> result = recipeRecommendationService.recommendRecipesByIngredients(currentUser.getUserId())
                .stream()
                .map(RecipeSummaryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<List<RecipeSummaryResponse>> recommendByIngredientList(
            @Valid @RequestBody RecipeRecommendationRequest request) {
        List<RecipeSummaryResponse> result = recipeRecommendationService.recommendRecipesByIngredientList(request.getIngredients())
                .stream()
                .map(RecipeSummaryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}

