package org.example.service.util;

import org.example.dto.recipe.RecipePrioritization;
import org.example.dto.recipe.RecipeSource;
import org.example.dto.recipe.UnifiedRecipeResponse;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 레시피 소스 병합 및 랭킹 유틸리티 클래스
 */
public class RecipeSourceMerger {

    /**
     * 두 레시피 리스트를 우선순위 전략에 따라 병합
     */
    public static List<UnifiedRecipeResponse> merge(
            List<UnifiedRecipeResponse> local,
            List<UnifiedRecipeResponse> crawled,
            RecipePrioritization strategy
    ) {
        // 중복 제거 먼저 수행
        List<UnifiedRecipeResponse> allRecipes = Stream.concat(local.stream(), crawled.stream())
                .collect(Collectors.toList());
        List<UnifiedRecipeResponse> uniqueRecipes = removeDuplicatesByTitle(allRecipes);

        // 전략별 정렬
        switch (strategy) {
            case LOCAL_FIRST:
                return mergeLocalFirst(uniqueRecipes);
            case CRAWLED_FIRST:
                return mergeCrawledFirst(uniqueRecipes);
            case MIXED:
            default:
                return mergeMixed(uniqueRecipes);
        }
    }

    /**
     * LOCAL_FIRST 전략: 로컬 레시피 우선
     */
    private static List<UnifiedRecipeResponse> mergeLocalFirst(List<UnifiedRecipeResponse> recipes) {
        List<UnifiedRecipeResponse> localRecipes = recipes.stream()
                .filter(r -> r.getSource() == RecipeSource.LOCAL_DB)
                .sorted(createLocalComparator())
                .collect(Collectors.toList());

        List<UnifiedRecipeResponse> crawledRecipes = recipes.stream()
                .filter(r -> r.getSource() == RecipeSource.EXTERNAL_CRAWL)
                .sorted(createCrawledComparator())
                .collect(Collectors.toList());

        List<UnifiedRecipeResponse> result = new ArrayList<>(localRecipes);
        result.addAll(crawledRecipes);
        return result;
    }

    /**
     * CRAWLED_FIRST 전략: 크롤링 레시피 우선
     */
    private static List<UnifiedRecipeResponse> mergeCrawledFirst(List<UnifiedRecipeResponse> recipes) {
        List<UnifiedRecipeResponse> crawledRecipes = recipes.stream()
                .filter(r -> r.getSource() == RecipeSource.EXTERNAL_CRAWL)
                .sorted(createCrawledComparator())
                .collect(Collectors.toList());

        List<UnifiedRecipeResponse> localRecipes = recipes.stream()
                .filter(r -> r.getSource() == RecipeSource.LOCAL_DB)
                .sorted(createLocalComparator())
                .collect(Collectors.toList());

        List<UnifiedRecipeResponse> result = new ArrayList<>(crawledRecipes);
        result.addAll(localRecipes);
        return result;
    }

    /**
     * MIXED 전략: 매칭률과 평점 기반 혼합 정렬
     */
    private static List<UnifiedRecipeResponse> mergeMixed(List<UnifiedRecipeResponse> recipes) {
        return recipes.stream()
                .sorted(createMixedComparator())
                .collect(Collectors.toList());
    }

    /**
     * 로컬 레시피용 Comparator (평점, 좋아요, 조회수 기반)
     */
    private static Comparator<UnifiedRecipeResponse> createLocalComparator() {
        return Comparator.<UnifiedRecipeResponse, BigDecimal>comparing(
                        r -> r.getAverageRating() != null ? r.getAverageRating() : BigDecimal.ZERO,
                        Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(r -> r.getLikeCount() != null ? r.getLikeCount() : 0,
                        Comparator.reverseOrder())
                .thenComparing(r -> r.getViewCount() != null ? r.getViewCount() : 0,
                        Comparator.reverseOrder());
    }

    /**
     * 크롤링 레시피용 Comparator (매칭률 기반)
     */
    private static Comparator<UnifiedRecipeResponse> createCrawledComparator() {
        return Comparator.comparing(UnifiedRecipeResponse::getMatchPercentage,
                Comparator.nullsLast(Comparator.reverseOrder()));
    }

    /**
     * MIXED 전략용 Comparator
     */
    public static Comparator<UnifiedRecipeResponse> createComparator(RecipePrioritization strategy) {
        switch (strategy) {
            case LOCAL_FIRST:
                return createLocalComparator();
            case CRAWLED_FIRST:
                return createCrawledComparator();
            case MIXED:
            default:
                return createMixedComparator();
        }
    }

    /**
     * MIXED 전략용 통합 Comparator
     */
    private static Comparator<UnifiedRecipeResponse> createMixedComparator() {
        return Comparator.<UnifiedRecipeResponse, Double>comparing(
                        UnifiedRecipeResponse::getMatchPercentage,
                        Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(r -> r.getAverageRating() != null ? r.getAverageRating() : BigDecimal.ZERO,
                        Comparator.reverseOrder())
                .thenComparing(r -> r.getLikeCount() != null ? r.getLikeCount() : 0,
                        Comparator.reverseOrder())
                .thenComparing(r -> r.getViewCount() != null ? r.getViewCount() : 0,
                        Comparator.reverseOrder())
                .thenComparing(r -> r.getSource() == RecipeSource.LOCAL_DB ? 0 : 1); // 동점 시 로컬 우선
    }

    /**
     * 제목 유사도 기반 중복 제거
     * 유사한 제목의 레시피가 있으면 로컬 DB 버전을 우선 선택
     */
    public static List<UnifiedRecipeResponse> removeDuplicatesByTitle(List<UnifiedRecipeResponse> recipes) {
        Map<String, UnifiedRecipeResponse> uniqueMap = new LinkedHashMap<>();

        for (UnifiedRecipeResponse recipe : recipes) {
            String normalizedTitle = normalizeTitle(recipe.getTitle());

            // 이미 존재하는 제목인지 확인
            boolean foundSimilar = false;
            for (String existingTitle : new ArrayList<>(uniqueMap.keySet())) {
                if (areSimilarTitles(normalizedTitle, existingTitle)) {
                    foundSimilar = true;
                    UnifiedRecipeResponse existing = uniqueMap.get(existingTitle);

                    // 로컬 DB 레시피를 우선 선택
                    if (recipe.getSource() == RecipeSource.LOCAL_DB &&
                        existing.getSource() == RecipeSource.EXTERNAL_CRAWL) {
                        uniqueMap.remove(existingTitle);
                        uniqueMap.put(normalizedTitle, recipe);
                    }
                    // 기존이 로컬이면 그대로 유지
                    break;
                }
            }

            if (!foundSimilar) {
                uniqueMap.put(normalizedTitle, recipe);
            }
        }

        return new ArrayList<>(uniqueMap.values());
    }

    /**
     * 제목 정규화 (공백 제거, 소문자 변환)
     */
    private static String normalizeTitle(String title) {
        if (title == null) return "";
        return title.toLowerCase().replaceAll("\\s+", "");
    }

    /**
     * 두 제목이 유사한지 판단
     */
    private static boolean areSimilarTitles(String title1, String title2) {
        if (title1 == null || title2 == null) return false;

        // 한쪽이 다른 쪽을 포함하면 유사한 것으로 간주
        if (title1.contains(title2) || title2.contains(title1)) {
            return true;
        }

        return false;
    }
}
