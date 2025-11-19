package org.example.service;

import org.example.entity.*;
import org.example.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class RecipeInteractionService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeLikeRepository recipeLikeRepository;
    private final RecipeCommentRepository recipeCommentRepository;
    private final RecipeRatingRepository recipeRatingRepository;
    private final SavedRecipeRepository savedRecipeRepository;

    public RecipeInteractionService(RecipeRepository recipeRepository,
                                    UserRepository userRepository,
                                    RecipeLikeRepository recipeLikeRepository,
                                    RecipeCommentRepository recipeCommentRepository,
                                    RecipeRatingRepository recipeRatingRepository,
                                    SavedRecipeRepository savedRecipeRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.recipeLikeRepository = recipeLikeRepository;
        this.recipeCommentRepository = recipeCommentRepository;
        this.recipeRatingRepository = recipeRatingRepository;
        this.savedRecipeRepository = savedRecipeRepository;
    }

    // Like
    @Transactional
    public boolean toggleLike(Long recipeId, Long userId) {
        Recipe recipe = getRecipe(recipeId);
        User user = getUser(userId);

        Optional<RecipeLike> existing = recipeLikeRepository.findByUserUserIdAndRecipeRecipeId(userId, recipeId);
        if (existing.isPresent()) {
            recipeLikeRepository.delete(existing.get());
            recipe.setLikeCount(Math.max(0, recipe.getLikeCount() - 1));
            recipeRepository.save(recipe);
            return false;
        } else {
            recipeLikeRepository.save(new RecipeLike(user, recipe));
            recipe.setLikeCount(recipe.getLikeCount() + 1);
            recipeRepository.save(recipe);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isLiked(Long recipeId, Long userId) {
        return recipeLikeRepository.existsByUserUserIdAndRecipeRecipeId(userId, recipeId);
    }

    // Comments
    @Transactional
    public RecipeComment addComment(Long recipeId, Long userId, String content) {
        Recipe recipe = getRecipe(recipeId);
        User user = getUser(userId);
        RecipeComment comment = new RecipeComment(recipe, user, content);
        RecipeComment saved = recipeCommentRepository.save(comment);
        recipe.setCommentCount(recipe.getCommentCount() + 1);
        recipeRepository.save(recipe);
        return saved;
    }

    @Transactional
    public RecipeComment updateComment(Long commentId, Long userId, String content) {
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Comment does not belong to user: " + userId);
        }
        comment.setContent(content);
        return recipeCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Comment does not belong to user: " + userId);
        }
        Recipe recipe = comment.getRecipe();
        recipeCommentRepository.delete(comment);
        recipe.setCommentCount(Math.max(0, recipe.getCommentCount() - 1));
        recipeRepository.save(recipe);
    }

    @Transactional(readOnly = true)
    public Page<RecipeComment> getComments(Long recipeId, Pageable pageable) {
        return recipeCommentRepository.findByRecipeRecipeIdOrderByCreatedAtDesc(recipeId, pageable);
    }

    // Ratings
    @Transactional
    public RecipeRating rateRecipe(Long recipeId, Long userId, Integer newRating) {
        if (newRating < 1 || newRating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        Recipe recipe = getRecipe(recipeId);
        User user = getUser(userId);
        Optional<RecipeRating> existing = recipeRatingRepository.findByUserUserIdAndRecipeRecipeId(userId, recipeId);

        RecipeRating saved;
        if (existing.isPresent()) {
            RecipeRating ratingEntity = existing.get();
            int oldRating = ratingEntity.getRating();
            ratingEntity.setRating(newRating);
            saved = recipeRatingRepository.save(ratingEntity);
            recipe.setRatingSum(recipe.getRatingSum() - oldRating + newRating);
        } else {
            RecipeRating ratingEntity = new RecipeRating(recipe, user, newRating);
            saved = recipeRatingRepository.save(ratingEntity);
            recipe.setRatingSum(recipe.getRatingSum() + newRating);
            recipe.setRatingCount(recipe.getRatingCount() + 1);
        }

        if (recipe.getRatingCount() > 0) {
            BigDecimal avg = BigDecimal.valueOf((double) recipe.getRatingSum() / recipe.getRatingCount())
                    .setScale(2, RoundingMode.HALF_UP);
            recipe.setAverageRating(avg);
        }
        recipeRepository.save(recipe);
        return saved;
    }

    @Transactional(readOnly = true)
    public Optional<RecipeRating> getUserRating(Long recipeId, Long userId) {
        return recipeRatingRepository.findByUserUserIdAndRecipeRecipeId(userId, recipeId);
    }

    // Save
    @Transactional
    public boolean toggleSave(Long recipeId, Long userId) {
        Recipe recipe = getRecipe(recipeId);
        User user = getUser(userId);

        Optional<SavedRecipe> existing = savedRecipeRepository.findByUserUserIdAndRecipeRecipeId(userId, recipeId);
        if (existing.isPresent()) {
            savedRecipeRepository.delete(existing.get());
            recipe.setSaveCount(Math.max(0, recipe.getSaveCount() - 1));
            recipeRepository.save(recipe);
            return false;
        } else {
            savedRecipeRepository.save(new SavedRecipe(user, recipe));
            recipe.setSaveCount(recipe.getSaveCount() + 1);
            recipeRepository.save(recipe);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isSaved(Long recipeId, Long userId) {
        return savedRecipeRepository.existsByUserUserIdAndRecipeRecipeId(userId, recipeId);
    }

    @Transactional(readOnly = true)
    public Page<SavedRecipe> getSavedRecipes(Long userId, Pageable pageable) {
        return savedRecipeRepository.findByUserUserIdOrderBySavedAtDesc(userId, pageable);
    }

    private Recipe getRecipe(Long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found: " + recipeId));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }
}

