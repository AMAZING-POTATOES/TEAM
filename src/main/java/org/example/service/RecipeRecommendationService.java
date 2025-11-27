package org.example.service;

import org.example.entity.Recipe;
import org.example.entity.RecipeIngredient;
import org.example.repository.RecipeRepository;
import org.example.repository.RefrigeratorItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class RecipeRecommendationService {

    private final RefrigeratorItemRepository refrigeratorItemRepository;
    private final RecipeRepository recipeRepository;

    public RecipeRecommendationService(RefrigeratorItemRepository refrigeratorItemRepository,
                                       RecipeRepository recipeRepository) {
        this.refrigeratorItemRepository = refrigeratorItemRepository;
        this.recipeRepository = recipeRepository;
    }

    @Transactional(readOnly = true)
    public List<Recipe> recommendRecipesByIngredients(Long userId) {
        return recommendRecipesByIngredients(userId, null);
    }

    @Transactional(readOnly = true)
    public List<Recipe> recommendRecipesByIngredients(Long userId, Integer maxResults) {
        List<String> userIngredients = refrigeratorItemRepository
                .findByUserUserIdOrderByExpirationDateAsc(userId)
                .stream()
                .map(item -> item.getIngredientName().toLowerCase())
                .collect(Collectors.toList());

        if (userIngredients.isEmpty()) {
            return List.of();
        }

        Stream<Recipe> stream = recipeRepository.findAll().stream()
                .filter(recipe -> matchesIngredients(recipe, userIngredients))
                .sorted(recommendationComparator());

        if (maxResults != null && maxResults > 0) {
            stream = stream.limit(maxResults);
        }

        return stream.collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Recipe> recommendRecipesByIngredientList(List<String> ingredients) {
        return recommendRecipesByIngredientList(ingredients, null);
    }

    @Transactional(readOnly = true)
    public List<Recipe> recommendRecipesByIngredientList(List<String> ingredients, Integer maxResults) {
        if (ingredients == null || ingredients.isEmpty()) {
            return List.of();
        }
        List<String> normalized = ingredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        Stream<Recipe> stream = recipeRepository.findAll().stream()
                .filter(recipe -> matchesIngredients(recipe, normalized))
                .sorted(recommendationComparator());

        if (maxResults != null && maxResults > 0) {
            stream = stream.limit(maxResults);
        }

        return stream.collect(Collectors.toList());
    }

    private boolean matchesIngredients(Recipe recipe, List<String> userIngredients) {
        List<String> required = recipe.getIngredients().stream()
                .map(RecipeIngredient::getIngredientName)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        if (required.isEmpty()) {
            return false;
        }

        long matchCount = required.stream()
                .filter(userIngredients::contains)
                .count();

        // 최소 1개 이상의 재료가 매칭되면 통과
        // 실제 필터링은 UnifiedRecipeRecommendationService에서 minMatchRate로 처리됨
        return matchCount > 0;
    }

    private Comparator<Recipe> recommendationComparator() {
        return Comparator
                .comparing(Recipe::getAverageRating, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Recipe::getLikeCount, Comparator.reverseOrder())
                .thenComparing(Recipe::getViewCount, Comparator.reverseOrder());
    }
}

