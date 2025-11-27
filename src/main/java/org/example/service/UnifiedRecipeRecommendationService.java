package org.example.service;

import org.example.dto.recipe.*;
import org.example.entity.Recipe;
import org.example.repository.RefrigeratorItemRepository;
import org.example.service.util.RecipeSourceMerger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

/**
 * 로컬 DB와 크롤링 레시피를 통합하여 추천하는 서비스
 */
@Service
public class UnifiedRecipeRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(UnifiedRecipeRecommendationService.class);

    private final RecipeRecommendationService recipeRecommendationService;
    private final RecipeCrawlerService recipeCrawlerService;
    private final RefrigeratorItemRepository refrigeratorItemRepository;

    public UnifiedRecipeRecommendationService(
            RecipeRecommendationService recipeRecommendationService,
            RecipeCrawlerService recipeCrawlerService,
            RefrigeratorItemRepository refrigeratorItemRepository
    ) {
        this.recipeRecommendationService = recipeRecommendationService;
        this.recipeCrawlerService = recipeCrawlerService;
        this.refrigeratorItemRepository = refrigeratorItemRepository;
    }

    /**
     * 사용자 냉장고 기반 통합 레시피 추천
     */
    @Transactional(readOnly = true)
    public List<UnifiedRecipeResponse> recommendRecipesByUserId(
            Long userId,
            UnifiedRecipeRecommendationRequest config
    ) {
        // 사용자의 냉장고 재료 조회
        List<String> userIngredients = refrigeratorItemRepository
                .findByUserUserIdOrderByExpirationDateAsc(userId)
                .stream()
                .map(item -> item.getIngredientName().toLowerCase())
                .collect(Collectors.toList());

        if (userIngredients.isEmpty()) {
            log.info("User {} has no refrigerator items", userId);
            return new ArrayList<>();
        }

        // 재료 리스트 기반 추천 호출
        return recommendRecipesByIngredients(userIngredients, config);
    }

    /**
     * 재료 리스트 기반 통합 레시피 추천 (비동기 병렬 실행)
     */
    public List<UnifiedRecipeResponse> recommendRecipesByIngredients(
            List<String> ingredients,
            UnifiedRecipeRecommendationRequest config
    ) {
        log.info("Starting unified recipe recommendation with {} ingredients", ingredients.size());

        // 로컬 DB 조회와 크롤링을 병렬로 실행
        CompletableFuture<List<UnifiedRecipeResponse>> localFuture =
                CompletableFuture.supplyAsync(() -> fetchLocalRecipes(ingredients, config));

        CompletableFuture<List<UnifiedRecipeResponse>> crawledFuture =
                CompletableFuture.supplyAsync(() -> fetchCrawledRecipes(ingredients, config));

        // 두 작업이 완료될 때까지 대기 (타임아웃 적용)
        try {
            List<UnifiedRecipeResponse> localResults = localFuture.get(3, TimeUnit.SECONDS);
            List<UnifiedRecipeResponse> crawledResults = crawledFuture.get(12, TimeUnit.SECONDS);

            log.info("Successfully fetched {} local and {} crawled recipes",
                    localResults.size(), crawledResults.size());

            // 결과 병합 및 필터링
            return mergeAndFilter(localResults, crawledResults, config);

        } catch (TimeoutException e) {
            log.error("Timeout while fetching recipes", e);
            // 완료된 결과라도 반환 시도
            List<UnifiedRecipeResponse> localResults = localFuture.getNow(new ArrayList<>());
            List<UnifiedRecipeResponse> crawledResults = crawledFuture.getNow(new ArrayList<>());

            log.info("Returning partial results: {} local, {} crawled",
                    localResults.size(), crawledResults.size());

            return mergeAndFilter(localResults, crawledResults, config);

        } catch (Exception e) {
            log.error("Error while fetching recipes", e);
            return new ArrayList<>();
        }
    }

    /**
     * 로컬 DB에서 레시피 조회
     */
    private List<UnifiedRecipeResponse> fetchLocalRecipes(
            List<String> ingredients,
            UnifiedRecipeRecommendationRequest config
    ) {
        try {
            List<Recipe> localRecipes = recipeRecommendationService
                    .recommendRecipesByIngredientList(ingredients, config.getMaxLocalResults());

            List<UnifiedRecipeResponse> results = localRecipes.stream()
                    .map(recipe -> UnifiedRecipeResponse.fromRecipe(recipe, ingredients))
                    .collect(Collectors.toList());

            log.info("Found {} local recipes", results.size());
            return results;

        } catch (Exception e) {
            log.error("Failed to fetch local recipes", e);
            return new ArrayList<>();
        }
    }

    /**
     * 외부 웹에서 레시피 크롤링
     */
    private List<UnifiedRecipeResponse> fetchCrawledRecipes(
            List<String> ingredients,
            UnifiedRecipeRecommendationRequest config
    ) {
        if (!config.getEnableCrawling()) {
            log.info("Crawling is disabled");
            return new ArrayList<>();
        }

        try {
            String searchKeyword = String.join(" ", ingredients);
            List<RecipeCrawlDTO> crawled = recipeCrawlerService
                    .crawlRecipeDetailsWithFallback(searchKeyword, config.getMaxCrawledResults());

            List<UnifiedRecipeResponse> results = crawled.stream()
                    .map(dto -> UnifiedRecipeResponse.fromRecipeCrawlDTO(dto, ingredients))
                    .collect(Collectors.toList());

            log.info("Found {} crawled recipes", results.size());
            return results;

        } catch (Exception e) {
            log.error("Failed to crawl external recipes", e);
            return new ArrayList<>();
        }
    }

    /**
     * 로컬과 크롤링 결과를 병합하고 필터링
     */
    private List<UnifiedRecipeResponse> mergeAndFilter(
            List<UnifiedRecipeResponse> local,
            List<UnifiedRecipeResponse> crawled,
            UnifiedRecipeRecommendationRequest config
    ) {
        // 최소 매칭률 필터링
        List<UnifiedRecipeResponse> filteredLocal = local.stream()
                .filter(r -> r.getMatchPercentage() >= config.getMinMatchRate())
                .collect(Collectors.toList());

        List<UnifiedRecipeResponse> filteredCrawled = crawled.stream()
                .filter(r -> r.getMatchPercentage() >= config.getMinMatchRate())
                .collect(Collectors.toList());

        log.info("After filtering (minMatchRate={}): {} local, {} crawled",
                config.getMinMatchRate(), filteredLocal.size(), filteredCrawled.size());

        // 병합 및 정렬
        return RecipeSourceMerger.merge(filteredLocal, filteredCrawled, config.getPrioritization());
    }
}
