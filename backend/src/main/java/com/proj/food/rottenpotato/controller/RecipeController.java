package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.dto.RecipeDTO;
import com.proj.food.rottenpotato.service.RecipeCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/recipes") // 요청 경로를 /recipes로 설정
public class RecipeController {

    private final RecipeCrawlerService recipeCrawlerService;

    @Autowired
    public RecipeController(RecipeCrawlerService recipeCrawlerService) {
        this.recipeCrawlerService = recipeCrawlerService;
    }

    /**
     * ✅ 사용자가 선택한 재료를 기반으로 레시피를 크롤링하여 반환합니다.
     * @param selectedIngredients 사용자가 선택한 재고 목록 (예: ["닭고기", "양파"])
     * @return 크롤링된 레시피 DTO 리스트
     */
    @PostMapping("/recommend")
    public List<RecipeDTO> recommendRecipes(@RequestBody List<String> selectedIngredients) {
        
        // 1. 선택된 재료를 크롤러가 사용할 수 있도록 공백으로 연결된 검색어 문자열로 변환
        String searchKeyword = selectedIngredients.stream()
                                                .collect(Collectors.joining(" "));

        // 2. 검색 키워드 기반으로 만개의 레시피 크롤링
        List<RecipeDTO> crawledRecipes = recipeCrawlerService.crawlRecipeDetails(searchKeyword);
        
        // 3. 재료가 비어있는 (기사/영상일 가능성이 높은) 레시피는 제외하고 반환
        return crawledRecipes.stream()
                .filter(recipe -> recipe.getIngredients() != null && !recipe.getIngredients().isEmpty()) 
                .collect(Collectors.toList());
    }
}