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
    private final org.example.service.RecipeCrawlerService recipeCrawlerService;
    private final org.example.service.GeminiRecipeGeneratorService geminiRecipeGeneratorService;
    private final org.example.service.UnifiedRecipeRecommendationService unifiedRecipeRecommendationService;

    public RecipeController(RecipeService recipeService,
                            RecipeInteractionService recipeInteractionService,
                            RecipeRecommendationService recipeRecommendationService,
                            org.example.service.RecipeCrawlerService recipeCrawlerService,
                            org.example.service.GeminiRecipeGeneratorService geminiRecipeGeneratorService,
                            org.example.service.UnifiedRecipeRecommendationService unifiedRecipeRecommendationService) {
        this.recipeService = recipeService;
        this.recipeInteractionService = recipeInteractionService;
        this.recipeRecommendationService = recipeRecommendationService;
        this.recipeCrawlerService = recipeCrawlerService;
        this.geminiRecipeGeneratorService = geminiRecipeGeneratorService;
        this.unifiedRecipeRecommendationService = unifiedRecipeRecommendationService;
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

    /**
     * 크롤링 기반 레시피 추천 (만개의레시피)
     * @param selectedIngredients 사용자가 선택한 재료 목록
     * @return 크롤링된 레시피 목록
     */
    @PostMapping("/recommend/crawl")
    public ResponseEntity<List<RecipeCrawlDTO>> recommendRecipesByCrawling(
            @RequestBody List<String> selectedIngredients) {

        if (selectedIngredients == null || selectedIngredients.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // 재료를 검색 키워드로 변환
        String searchKeyword = String.join(" ", selectedIngredients);

        // 크롤링 수행
        List<RecipeCrawlDTO> crawledRecipes = recipeCrawlerService.crawlRecipeDetails(searchKeyword);

        return ResponseEntity.ok(crawledRecipes);
    }

    /**
     * AI 기반 레시피 생성 (Gemini API)
     * @param request Gemini API 요청 데이터
     * @return AI가 생성한 레시피
     */
    @PostMapping("/generate/ai")
    public ResponseEntity<org.example.dto.recipe.GeminiRecipeResponse> generateRecipeWithAI(
            @RequestBody org.example.dto.recipe.GeminiRecipeRequest request) {
                System.out.println("AI Recipe Generation Called");

        org.example.dto.recipe.GeminiRecipeResponse response = geminiRecipeGeneratorService.generateRecipe(request);

        return ResponseEntity.ok(response);
    }

    /**
     * 통합 레시피 추천 (로컬 DB + 크롤링) - GET 버전 (기본 설정 사용)
     * 사용자의 냉장고 재료를 기반으로 기본 설정으로 추천
     * @param currentUser 현재 인증된 사용자
     * @return 로컬 DB와 크롤링 결과를 병합한 통합 레시피 목록
     */
    @GetMapping("/recommendations/unified")
    public ResponseEntity<List<UnifiedRecipeResponse>> getUnifiedRecommendationsByRefrigerator(
            @AuthenticationPrincipal JwtUserDetails currentUser) {

        // 기본 설정 사용
        UnifiedRecipeRecommendationRequest defaultConfig = new UnifiedRecipeRecommendationRequest();
        // ingredients는 서비스에서 냉장고에서 가져오므로 빈 리스트로 설정
        defaultConfig.setIngredients(new java.util.ArrayList<>());

        List<UnifiedRecipeResponse> results = unifiedRecipeRecommendationService
                .recommendRecipesByUserId(currentUser.getUserId(), defaultConfig);

        return ResponseEntity.ok(results);
    }

    /**
     * 통합 레시피 추천 (로컬 DB + 크롤링) - POST 버전 (커스텀 설정)
     * 사용자가 직접 재료 목록과 설정을 지정하여 추천
     * @param currentUser 현재 인증된 사용자
     * @param request 통합 추천 설정 요청
     * @return 로컬 DB와 크롤링 결과를 병합한 통합 레시피 목록
     */
    @PostMapping("/recommendations/unified")
    public ResponseEntity<List<UnifiedRecipeResponse>> getUnifiedRecommendationsWithConfig(
            @AuthenticationPrincipal JwtUserDetails currentUser,
            @Valid @RequestBody UnifiedRecipeRecommendationRequest request) {

        List<UnifiedRecipeResponse> results = unifiedRecipeRecommendationService
                .recommendRecipesByIngredients(request.getIngredients(), request);

        return ResponseEntity.ok(results);
    }
}

