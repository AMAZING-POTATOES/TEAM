package org.example.dto.recipe;

/**
 * 레시피 추천 우선순위 전략을 나타내는 Enum
 */
public enum RecipePrioritization {
    /**
     * 로컬 데이터베이스 레시피를 우선적으로 표시
     */
    LOCAL_FIRST,

    /**
     * 크롤링된 외부 레시피를 우선적으로 표시
     */
    CRAWLED_FIRST,

    /**
     * 매칭률과 평점을 기반으로 혼합하여 정렬
     */
    MIXED
}
