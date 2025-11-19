package org.example.service;

import org.example.entity.*;
import org.example.entity.enums.Difficulty;
import org.example.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeStepRepository recipeStepRepository;
    private final RecipeTagRepository recipeTagRepository;

    public RecipeService(RecipeRepository recipeRepository,
                         UserRepository userRepository,
                         RecipeIngredientRepository recipeIngredientRepository,
                         RecipeStepRepository recipeStepRepository,
                         RecipeTagRepository recipeTagRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.recipeStepRepository = recipeStepRepository;
        this.recipeTagRepository = recipeTagRepository;
    }

    @Transactional
    public Recipe createRecipe(Long userId, String title, String description, String mainImageUrl,
                               Difficulty difficulty, Integer cookingTime, Integer servings,
                               String category, List<String> ingredientNames, List<String> quantities,
                               List<String> steps, List<String> tags) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Recipe recipe = new Recipe();
        recipe.setUser(user);
        recipe.setTitle(title);
        recipe.setDescription(description);
        recipe.setMainImageUrl(mainImageUrl);
        recipe.setDifficulty(difficulty);
        recipe.setCookingTime(cookingTime);
        recipe.setServings(servings);
        recipe.setCategory(category);

        Recipe saved = recipeRepository.save(recipe);
        addIngredients(saved, ingredientNames, quantities);
        addSteps(saved, steps);
        addTags(saved, tags);
        return recipeRepository.save(saved);
    }

    @Transactional
    public Recipe updateRecipe(Long recipeId, Long userId, String title, String description,
                               String mainImageUrl, Difficulty difficulty, Integer cookingTime,
                               Integer servings, String category, List<String> ingredientNames,
                               List<String> quantities, List<String> steps, List<String> tags) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId));
        ensureOwner(recipe, userId);

        recipe.setTitle(title);
        recipe.setDescription(description);
        recipe.setMainImageUrl(mainImageUrl);
        recipe.setDifficulty(difficulty);
        recipe.setCookingTime(cookingTime);
        recipe.setServings(servings);
        recipe.setCategory(category);

        recipeIngredientRepository.deleteAll(recipe.getIngredients());
        recipeStepRepository.deleteAll(recipe.getSteps());
        recipeTagRepository.deleteAll(recipe.getTags());
        recipe.getIngredients().clear();
        recipe.getSteps().clear();
        recipe.getTags().clear();

        addIngredients(recipe, ingredientNames, quantities);
        addSteps(recipe, steps);
        addTags(recipe, tags);

        return recipeRepository.save(recipe);
    }

    @Transactional
    public void deleteRecipe(Long recipeId, Long userId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId));
        ensureOwner(recipe, userId);
        recipeRepository.delete(recipe);
    }

    @Transactional(readOnly = true)
    public Optional<Recipe> getRecipeDetail(Long recipeId) {
        return recipeRepository.findById(recipeId)
                .map(recipe -> {
                    recipe.getIngredients().size();
                    recipe.getSteps().size();
                    recipe.getTags().size();
                    return recipe;
                });
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getRecipes(Pageable pageable) {
        return recipeRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getRecipesByUserId(Long userId, Pageable pageable) {
        return recipeRepository.findByUserUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getPopularRecipes(Pageable pageable) {
        return recipeRepository.findPopularRecipes(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getRecipesByCategory(String category, Pageable pageable) {
        return recipeRepository.findByCategory(category, pageable);
    }

    @Transactional(readOnly = true)
    public List<Recipe> searchRecipesByIngredient(String ingredientName) {
        return recipeRepository.findByIngredientNameContaining(ingredientName);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> searchRecipesByKeyword(String keyword, Pageable pageable) {
        return recipeRepository.searchByKeyword(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> searchRecipesByTag(String tagName, Pageable pageable) {
        return recipeRepository.findByTagName(tagName, pageable);
    }

    @Transactional
    public void incrementViewCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId));
        recipe.setViewCount(recipe.getViewCount() + 1);
        recipeRepository.save(recipe);
    }

    private void addIngredients(Recipe recipe, List<String> ingredientNames, List<String> quantities) {
        if (ingredientNames == null || quantities == null) {
            return;
        }
        List<RecipeIngredient> list = new ArrayList<>();
        for (int i = 0; i < ingredientNames.size() && i < quantities.size(); i++) {
            RecipeIngredient ingredient = new RecipeIngredient();
            ingredient.setRecipe(recipe);
            ingredient.setIngredientName(ingredientNames.get(i));
            ingredient.setQuantity(quantities.get(i));
            list.add(ingredient);
        }
        recipe.getIngredients().addAll(list);
    }

    private void addSteps(Recipe recipe, List<String> descriptions) {
        if (descriptions == null) {
            return;
        }
        List<RecipeStep> list = new ArrayList<>();
        for (int i = 0; i < descriptions.size(); i++) {
            RecipeStep step = new RecipeStep();
            step.setRecipe(recipe);
            step.setStepNumber(i + 1);
            step.setDescription(descriptions.get(i));
            list.add(step);
        }
        recipe.getSteps().addAll(list);
    }

    private void addTags(Recipe recipe, List<String> tagNames) {
        if (tagNames == null) {
            return;
        }
        List<RecipeTag> list = new ArrayList<>();
        for (String tagName : tagNames) {
            RecipeTag tag = new RecipeTag();
            tag.setRecipe(recipe);
            tag.setTagName(tagName);
            list.add(tag);
        }
        recipe.getTags().addAll(list);
    }

    private void ensureOwner(Recipe recipe, Long userId) {
        if (!recipe.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Recipe does not belong to user: " + userId);
        }
    }
}

