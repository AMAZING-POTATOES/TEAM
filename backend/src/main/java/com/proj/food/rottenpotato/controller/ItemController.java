package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.dto.RecipeDTO;
import com.proj.food.rottenpotato.service.ItemService;
import com.proj.food.rottenpotato.service.RecipeCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.AbstractMap;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory")
public class ItemController {

    private final ItemService itemService;
    private final RecipeCrawlerService recipeCrawlerService;

    @Autowired
    public ItemController(ItemService itemService, RecipeCrawlerService recipeCrawlerService) {
        this.itemService = itemService;
        this.recipeCrawlerService = recipeCrawlerService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllInventory() {
        return itemService.getAllItems();
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        boolean isDeleted = itemService.deleteItem(itemId);

        if (isDeleted) {
            return ResponseEntity.ok(itemId + "번 품목이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body(itemId + "번 품목을 찾을 수 없거나 삭제에 실패했습니다.");
        }
    }

    /**
     * ✅ [최종 로직] 재고 기반 레시피를 추천하고, 메인 재료 우선순위로 정렬합니다.
     * @param selectedIngredients 사용자가 선택한 재고 품목 리스트 (예: ["닭고기", "양파"])
     */
    @PostMapping("/recommend")
    public List<RecipeDTO> recommendRecipes(@RequestBody List<String> selectedIngredients) {

        if (selectedIngredients == null || selectedIngredients.isEmpty()) {
            return List.of();
        }
        
        // 1. 재료를 검색 키워드로 변환
        String searchKeyword = selectedIngredients.stream()
                .collect(Collectors.joining(" "));

        // 2. 크롤링 수행
        List<RecipeDTO> crawledRecipes = recipeCrawlerService.crawlRecipeDetails(searchKeyword);
        
        // 3. 재료 매칭 점수 계산 및 정렬 (우선순위 로직)
        List<String> normalizedSelectedIngredients = selectedIngredients.stream()
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toList());
        
        String mainIngredient = normalizedSelectedIngredients.get(0); // 첫 번째 재료를 메인 재료로 간주

        return crawledRecipes.stream()
                .filter(recipe -> recipe.getIngredients() != null && !recipe.getIngredients().isEmpty())
                .map(recipe -> {
                    // 3-1. 레시피 재료를 소문자로 변환 (크롤링 데이터 정규화)
                    List<String> normalizedRecipeIngredients = recipe.getIngredients().stream()
                        .map(s -> s.toLowerCase(Locale.ROOT))
                        .collect(Collectors.toList());

                    // 3-2. 기본 점수: 일치하는 재료 개수 카운트
                    long matchCount = normalizedSelectedIngredients.stream()
                        .filter(normalizedRecipeIngredients::contains)
                        .count();
                    
                    // 3-3. 메인 재료 보너스: 메인 재료 포함 시 100점 가산
                    long mainIngredientBonus = normalizedRecipeIngredients.stream()
                        .anyMatch(recipeIngredient -> recipeIngredient.contains(mainIngredient)) 
                        ? 100L : 0L;
                    
                    long totalScore = matchCount + mainIngredientBonus;
                    
                    return new AbstractMap.SimpleEntry<>(recipe, totalScore);
                })
                .filter(entry -> entry.getValue() > 0) // 매칭 점수가 0인 레시피는 제외
                .sorted(Comparator.comparing(AbstractMap.SimpleEntry<RecipeDTO, Long>::getValue).reversed()) // 총점 내림차순 정렬
                .map(AbstractMap.SimpleEntry::getKey) 
                .collect(Collectors.toList());
    }
}