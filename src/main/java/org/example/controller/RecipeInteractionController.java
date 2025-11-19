package org.example.controller;

import jakarta.validation.Valid;
import org.example.dto.interaction.*;
import org.example.dto.recipe.RecipeDetailResponse;
import org.example.dto.recipe.RecipeSummaryResponse;
import org.example.security.JwtUserDetails;
import org.example.service.RecipeInteractionService;
import org.example.service.RecipeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
public class RecipeInteractionController {

    private final RecipeInteractionService recipeInteractionService;
    private final RecipeService recipeService;

    public RecipeInteractionController(RecipeInteractionService recipeInteractionService,
                                       RecipeService recipeService) {
        this.recipeInteractionService = recipeInteractionService;
        this.recipeService = recipeService;
    }

    @PostMapping("/{recipeId}/like")
    public ResponseEntity<RecipeLikeResponse> likeRecipe(@PathVariable Long recipeId,
                                                         @AuthenticationPrincipal JwtUserDetails currentUser) {
        boolean alreadyLiked = recipeInteractionService.isLiked(recipeId, currentUser.getUserId());
        boolean liked = alreadyLiked || recipeInteractionService.toggleLike(recipeId, currentUser.getUserId());
        int likeCount = recipeService.getRecipeDetail(recipeId)
                .map(RecipeDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId))
                .getLikeCount();
        return ResponseEntity.ok(new RecipeLikeResponse(recipeId, liked, likeCount));
    }

    @DeleteMapping("/{recipeId}/like")
    public ResponseEntity<RecipeLikeResponse> unlikeRecipe(@PathVariable Long recipeId,
                                                           @AuthenticationPrincipal JwtUserDetails currentUser) {
        boolean alreadyLiked = recipeInteractionService.isLiked(recipeId, currentUser.getUserId());
        boolean liked = alreadyLiked ? recipeInteractionService.toggleLike(recipeId, currentUser.getUserId()) : false;
        int likeCount = recipeService.getRecipeDetail(recipeId)
                .map(RecipeDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId))
                .getLikeCount();
        return ResponseEntity.ok(new RecipeLikeResponse(recipeId, liked, likeCount));
    }

    @GetMapping("/{recipeId}/comments")
    public ResponseEntity<Page<RecipeCommentResponse>> getComments(@PathVariable Long recipeId,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeCommentResponse> result = recipeInteractionService.getComments(recipeId, pageable)
                .map(RecipeCommentResponse::from);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<RecipeCommentResponse> addComment(@PathVariable Long recipeId,
                                                            @AuthenticationPrincipal JwtUserDetails currentUser,
                                                            @Valid @RequestBody RecipeCommentRequest request) {
        var comment = recipeInteractionService.addComment(recipeId, currentUser.getUserId(), request.getContent());
        return ResponseEntity.ok(RecipeCommentResponse.from(comment));
    }

    @PutMapping("/{recipeId}/comments/{commentId}")
    public ResponseEntity<RecipeCommentResponse> updateComment(@PathVariable Long recipeId,
                                                               @PathVariable Long commentId,
                                                               @AuthenticationPrincipal JwtUserDetails currentUser,
                                                               @Valid @RequestBody RecipeCommentRequest request) {
        var comment = recipeInteractionService.updateComment(commentId, currentUser.getUserId(), request.getContent());
        return ResponseEntity.ok(RecipeCommentResponse.from(comment));
    }

    @DeleteMapping("/{recipeId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId,
                                              @PathVariable Long commentId,
                                              @AuthenticationPrincipal JwtUserDetails currentUser) {
        recipeInteractionService.deleteComment(commentId, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{recipeId}/ratings")
    public ResponseEntity<RecipeRatingResponse> rateRecipe(@PathVariable Long recipeId,
                                                           @AuthenticationPrincipal JwtUserDetails currentUser,
                                                           @Valid @RequestBody RecipeRatingRequest request) {
        var rating = recipeInteractionService.rateRecipe(recipeId, currentUser.getUserId(), request.getRating());
        return ResponseEntity.ok(RecipeRatingResponse.from(rating));
    }

    @GetMapping("/{recipeId}/ratings/me")
    public ResponseEntity<RecipeRatingResponse> getMyRating(@PathVariable Long recipeId,
                                                            @AuthenticationPrincipal JwtUserDetails currentUser) {
        var rating = recipeInteractionService.getUserRating(recipeId, currentUser.getUserId())
                .map(RecipeRatingResponse::from)
                .orElse(null);
        return ResponseEntity.ok(rating);
    }

    @PostMapping("/{recipeId}/save")
    public ResponseEntity<RecipeSaveResponse> saveRecipe(@PathVariable Long recipeId,
                                                         @AuthenticationPrincipal JwtUserDetails currentUser) {
        boolean alreadySaved = recipeInteractionService.isSaved(recipeId, currentUser.getUserId());
        boolean saved = alreadySaved || recipeInteractionService.toggleSave(recipeId, currentUser.getUserId());
        int saveCount = recipeService.getRecipeDetail(recipeId)
                .map(RecipeDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId))
                .getSaveCount();
        return ResponseEntity.ok(new RecipeSaveResponse(recipeId, saved, saveCount));
    }

    @DeleteMapping("/{recipeId}/save")
    public ResponseEntity<RecipeSaveResponse> unsaveRecipe(@PathVariable Long recipeId,
                                                           @AuthenticationPrincipal JwtUserDetails currentUser) {
        boolean alreadySaved = recipeInteractionService.isSaved(recipeId, currentUser.getUserId());
        boolean saved = alreadySaved ? recipeInteractionService.toggleSave(recipeId, currentUser.getUserId()) : false;
        int saveCount = recipeService.getRecipeDetail(recipeId)
                .map(RecipeDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId))
                .getSaveCount();
        return ResponseEntity.ok(new RecipeSaveResponse(recipeId, saved, saveCount));
    }

    @GetMapping("/saved")
    public ResponseEntity<Page<RecipeSummaryResponse>> getSavedRecipes(@AuthenticationPrincipal JwtUserDetails currentUser,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeSummaryResponse> result = recipeInteractionService
                .getSavedRecipes(currentUser.getUserId(), pageable)
                .map(saved -> RecipeSummaryResponse.from(saved.getRecipe()));
        return ResponseEntity.ok(result);
    }
}

