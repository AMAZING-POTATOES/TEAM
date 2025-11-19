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
        List<String> userIngredients = refrigeratorItemRepository
                .findByUserUserIdOrderByExpirationDateAsc(userId)
                .stream()
                .map(item -> item.getIngredientName().toLowerCase())
                .collect(Collectors.toList());

        if (userIngredients.isEmpty()) {
            return List.of();
        }

        return recipeRepository.findAll().stream()
                .filter(recipe -> matchesIngredients(recipe, userIngredients))
                .sorted(recommendationComparator())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Recipe> recommendRecipesByIngredientList(List<String> ingredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            return List.of();
        }
        List<String> normalized = ingredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        return recipeRepository.findAll().stream()
                .filter(recipe -> matchesIngredients(recipe, normalized))
                .sorted(recommendationComparator())
                .collect(Collectors.toList());
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

        double matchRate = (double) matchCount / required.size();
        return matchRate >= 0.7;
    }

    private Comparator<Recipe> recommendationComparator() {
        return Comparator
                .comparing(Recipe::getAverageRating, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Recipe::getLikeCount, Comparator.reverseOrder())
                .thenComparing(Recipe::getViewCount, Comparator.reverseOrder());
    }
}

