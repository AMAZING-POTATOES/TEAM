package org.example.dto.recipe;

import org.example.entity.Recipe;
import org.example.entity.RecipeIngredient;
import org.example.entity.enums.Difficulty;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 로컬 DB와 크롤링 레시피를 모두 표현할 수 있는 통합 응답 DTO
 */
public class UnifiedRecipeResponse {

    private Long recipeId;
    private String title;
    private String mainImageUrl;
    private String url; // 외부 레시피만 해당 (LOCAL_DB는 null)
    private RecipeSource source;
    private List<String> ingredients;
    private Integer matchedIngredientCount;
    private Double matchPercentage;

    // 로컬 레시피만 해당 (nullable)
    private Integer cookingTime;
    private Difficulty difficulty;
    private Integer servings;
    private String category;
    private Integer viewCount;
    private Integer likeCount;
    private BigDecimal averageRating;
    private Boolean isAiGenerated;
    private LocalDateTime createdAt;

    // 기본 생성자
    public UnifiedRecipeResponse() {
    }

    /**
     * Recipe 엔티티로부터 UnifiedRecipeResponse 생성 (로컬 DB)
     */
    public static UnifiedRecipeResponse fromRecipe(Recipe recipe, List<String> userIngredients) {
        UnifiedRecipeResponse response = new UnifiedRecipeResponse();
        response.recipeId = recipe.getRecipeId();
        response.title = recipe.getTitle();
        response.mainImageUrl = recipe.getMainImageUrl();
        response.url = null; // 로컬 레시피는 URL 없음
        response.source = RecipeSource.LOCAL_DB;

        // 재료 추출
        response.ingredients = recipe.getIngredients().stream()
                .map(RecipeIngredient::getIngredientName)
                .collect(Collectors.toList());

        // 매칭 재료 계산
        response.calculateMatching(userIngredients);

        // 로컬 레시피 고유 정보
        response.cookingTime = recipe.getCookingTime();
        response.difficulty = recipe.getDifficulty();
        response.servings = recipe.getServings();
        response.category = recipe.getCategory();
        response.viewCount = recipe.getViewCount();
        response.likeCount = recipe.getLikeCount();
        response.averageRating = recipe.getAverageRating();
        response.isAiGenerated = recipe.getIsAiGenerated();
        response.createdAt = recipe.getCreatedAt();

        return response;
    }

    /**
     * RecipeCrawlDTO로부터 UnifiedRecipeResponse 생성 (크롤링)
     */
    public static UnifiedRecipeResponse fromRecipeCrawlDTO(RecipeCrawlDTO dto, List<String> userIngredients) {
        UnifiedRecipeResponse response = new UnifiedRecipeResponse();
        response.recipeId = dto.getRecipeId();
        response.title = dto.getTitle();
        response.mainImageUrl = dto.getImgUrl();
        response.url = dto.getUrl(); // 외부 레시피는 URL 있음
        response.source = RecipeSource.EXTERNAL_CRAWL;

        // 재료
        response.ingredients = dto.getIngredients();

        // 매칭 재료 계산
        response.calculateMatching(userIngredients);

        // 크롤링 레시피는 이하 필드가 null
        response.cookingTime = null;
        response.difficulty = null;
        response.servings = null;
        response.category = null;
        response.viewCount = null;
        response.likeCount = null;
        response.averageRating = null;
        response.isAiGenerated = null;
        response.createdAt = null;

        return response;
    }

    /**
     * 사용자 재료와의 매칭 계산
     */
    private void calculateMatching(List<String> userIngredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            this.matchedIngredientCount = 0;
            this.matchPercentage = 0.0;
            return;
        }

        List<String> normalizedRecipe = ingredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        List<String> normalizedUser = userIngredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        long matchCount = normalizedRecipe.stream()
                .filter(normalizedUser::contains)
                .count();

        this.matchedIngredientCount = (int) matchCount;
        this.matchPercentage = (double) matchCount / ingredients.size();
    }

    // Getters and Setters
    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public RecipeSource getSource() {
        return source;
    }

    public void setSource(RecipeSource source) {
        this.source = source;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public Integer getMatchedIngredientCount() {
        return matchedIngredientCount;
    }

    public void setMatchedIngredientCount(Integer matchedIngredientCount) {
        this.matchedIngredientCount = matchedIngredientCount;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public Integer getCookingTime() {
        return cookingTime;
    }

    public void setCookingTime(Integer cookingTime) {
        this.cookingTime = cookingTime;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Boolean getIsAiGenerated() {
        return isAiGenerated;
    }

    public void setIsAiGenerated(Boolean isAiGenerated) {
        this.isAiGenerated = isAiGenerated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
