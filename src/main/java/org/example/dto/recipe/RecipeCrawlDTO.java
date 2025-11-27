package org.example.dto.recipe;

import java.util.List;

/**
 * 레시피 크롤링 시스템의 데이터를 담을 DTO
 * 만개의레시피 웹 크롤링 결과를 저장
 */
public class RecipeCrawlDTO {

    // 레시피 고유 ID (만개의 레시피 URL에서 추출)
    private Long recipeId;

    // 레시피 제목
    private String title;

    // 레시피 상세 URL
    private String url;

    // 레시피 대표 이미지 URL
    private String imgUrl;

    // 냉장고 품목과 매칭할 필수 재료 목록
    private List<String> ingredients;

    // 조리 시간/난이도 등 (선택적)
    private String time;

    // 기본 생성자
    public RecipeCrawlDTO() {
    }

    // 전체 생성자
    public RecipeCrawlDTO(Long recipeId, String title, String url, String imgUrl,
                          List<String> ingredients, String time) {
        this.recipeId = recipeId;
        this.title = title;
        this.url = url;
        this.imgUrl = imgUrl;
        this.ingredients = ingredients;
        this.time = time;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "RecipeCrawlDTO{" +
                "recipeId=" + recipeId +
                ", title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", imgUrl='" + imgUrl + '\'' +
                ", ingredients=" + ingredients +
                ", time='" + time + '\'' +
                '}';
    }
}
