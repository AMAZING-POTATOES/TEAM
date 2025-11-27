package org.example.dto.recipe;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;

import java.util.List;

/**
 * 통합 레시피 추천 요청 DTO
 */
public class UnifiedRecipeRecommendationRequest {

    @NotEmpty(message = "재료 리스트는 비어 있을 수 없습니다")
    private List<String> ingredients;

    @Min(value = 1, message = "로컬 결과는 최소 1개 이상이어야 합니다")
    private Integer maxLocalResults = 10;

    @Min(value = 1, message = "크롤링 결과는 최소 1개 이상이어야 합니다")
    private Integer maxCrawledResults = 5;

    private Boolean enableCrawling = true;

    private RecipePrioritization prioritization = RecipePrioritization.MIXED;

    @DecimalMin(value = "0.0", message = "최소 매칭률은 0.0 이상이어야 합니다")
    private Double minMatchRate = 0.0;

    // 기본 생성자
    public UnifiedRecipeRecommendationRequest() {
    }

    // Getters and Setters
    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public Integer getMaxLocalResults() {
        return maxLocalResults;
    }

    public void setMaxLocalResults(Integer maxLocalResults) {
        this.maxLocalResults = maxLocalResults;
    }

    public Integer getMaxCrawledResults() {
        return maxCrawledResults;
    }

    public void setMaxCrawledResults(Integer maxCrawledResults) {
        this.maxCrawledResults = maxCrawledResults;
    }

    public Boolean getEnableCrawling() {
        return enableCrawling;
    }

    public void setEnableCrawling(Boolean enableCrawling) {
        this.enableCrawling = enableCrawling;
    }

    public RecipePrioritization getPrioritization() {
        return prioritization;
    }

    public void setPrioritization(RecipePrioritization prioritization) {
        this.prioritization = prioritization;
    }

    public Double getMinMatchRate() {
        return minMatchRate;
    }

    public void setMinMatchRate(Double minMatchRate) {
        this.minMatchRate = minMatchRate;
    }
}
