/* 레시피 추천 시스템의 데이터를 담을 Java 객체 */

package com.proj.food.rottenpotato.dto;

import lombok.Data;
import java.util.List;

@Data // Lombok을 사용하여 Getter, Setter, toString 등을 자동 생성합니다.
public class RecipeDTO {
    
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
}