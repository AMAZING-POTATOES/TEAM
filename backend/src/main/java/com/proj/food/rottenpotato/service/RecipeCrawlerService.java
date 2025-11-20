package com.proj.food.rottenpotato.service;

import com.proj.food.rottenpotato.dto.RecipeDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeCrawlerService {

    /**
     * 사용자가 선택한 재료를 기반으로 만개의 레시피를 크롤링합니다.
     * @param searchKeyword 사용자가 선택한 재료를 공백으로 연결한 문자열 (예: "닭고기 양파")
     * @param maxCount 크롤링할 최대 레시피 개수
     * @return 재료 정보가 포함된 RecipeDTO 리스트
     */
    public List<RecipeDTO> crawlRecipeDetails(String searchKeyword, int maxCount) {
        List<RecipeDTO> recipes = new ArrayList<>();
        
        String encodedKeyword;
        try {
            encodedKeyword = URLEncoder.encode(searchKeyword, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            encodedKeyword = searchKeyword; 
        }
        
        String searchUrl = "https://www.10000recipe.com/recipe/list.html?q=" + encodedKeyword;
        
        try {
            // 1. 검색 페이지 접속 (1차 크롤링)
            Document doc = Jsoup.connect(searchUrl).timeout(8000).get(); 
            Elements listItems = doc.select(".common_sp_list_ul li"); 

            // 최대 개수만큼 레시피 추출
            for (int i = 0; i < Math.min(listItems.size(), maxCount); i++) {
                Element item = listItems.get(i);
                RecipeDTO recipe = new RecipeDTO();

                // 1-1. 상세 URL, 제목 추출
                Element link = item.selectFirst(".common_sp_link");
                if (link == null) continue;

                String relativeUrl = link.attr("href"); // 예: /recipe/6822165
                recipe.setUrl("https://www.10000recipe.com" + relativeUrl);
                recipe.setTitle(item.selectFirst(".common_sp_caption_tit").text());
                
                // URL에서 ID 추출
                String[] parts = relativeUrl.split("/");
                if (parts.length > 0) {
                    try {
                        recipe.setRecipeId(Long.parseLong(parts[parts.length - 1]));
                    } catch (NumberFormatException ignored) { /* ID가 숫자가 아니면 무시 */ }
                }

                // 1-2. 이미지 URL 추출
                Element img = item.selectFirst(".common_sp_thumb img");
                if (img != null) {
                    recipe.setImgUrl(img.attr("src"));
                }
                
                // 2. 상세 페이지 접속 (2차 크롤링: 재료 목록 추출)
                List<String> ingredients = crawlIngredients(recipe.getUrl());
                recipe.setIngredients(ingredients);
                
                recipes.add(recipe);
            }
            
        } catch (IOException e) {
            System.err.println("검색 페이지 크롤링 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
        return recipes;
    }
    
    // -------------------------------------------------------------------------
    // 레시피 상세 페이지에서 재료만 추출하는 보조 메소드
    // -------------------------------------------------------------------------
    private List<String> crawlIngredients(String detailUrl) {
        List<String> ingredients = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(detailUrl).timeout(5000).get();

            // 1. 필수 재료 영역의 모든 항목을 선택하는 CSS 선택자
            Elements mainIrdnts = doc.select("#divConfirmedMaterialArea ul li");

            for (Element element : mainIrdnts) {
                Element aTag = element.selectFirst("a");
                if (aTag == null) continue; 
                
                String ingredientText = aTag.text();
                
                if (ingredientText != null && !ingredientText.trim().isEmpty()) {
                    // 괄호 안의 용량 정보(예: '사과(1개)')는 제거
                    String ingredientName = ingredientText.trim();
                    if (ingredientName.contains("(")) {
                        ingredientName = ingredientName.substring(0, ingredientName.indexOf("(")).trim();
                    }
                    if (!ingredientName.isEmpty()) {
                        ingredients.add(ingredientName);
                    }
                }
            }
            
        } catch (IOException e) {
            System.err.println("상세 페이지 크롤링 중 오류 발생: " + detailUrl + " - " + e.getMessage());
        }
        return ingredients;
    }

    // 기본 크롤링 개수를 5개로 설정하는 오버로드 메소드 (컨트롤러 사용용)
    public List<RecipeDTO> crawlRecipeDetails(String searchKeyword) {
        return crawlRecipeDetails(searchKeyword, 5);
    }
}