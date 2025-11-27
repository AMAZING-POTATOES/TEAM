package org.example.service;

import org.example.dto.recipe.RecipeCrawlDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * 만개의레시피 웹사이트에서 레시피를 크롤링하는 서비스
 * - 동영상 레시피 자동 필터링
 * - 이미지 레시피만 추출
 * - 재료 정보 수집
 */
@Service
public class RecipeCrawlerService {

    private static final Logger log = LoggerFactory.getLogger(RecipeCrawlerService.class);
    private static final String BASE_URL = "https://www.10000recipe.com";
    private static final int SEARCH_TIMEOUT_MS = 8000;
    private static final int DETAIL_TIMEOUT_MS = 5000;

    /**
     * 사용자가 선택한 재료를 기반으로 만개의 레시피를 크롤링합니다.
     * 동영상 레시피는 자동으로 제외하고 이미지 레시피만 반환합니다.
     *
     * @param searchKeyword 사용자가 선택한 재료를 공백으로 연결한 문자열 (예: "닭고기 양파")
     * @param maxCount 크롤링할 최대 레시피 개수
     * @return 재료 정보가 포함된 RecipeCrawlDTO 리스트
     */
    public List<RecipeCrawlDTO> crawlRecipeDetails(String searchKeyword, int maxCount) {
        List<RecipeCrawlDTO> recipes = new ArrayList<>();

        log.info("레시피 크롤링 시작: keyword='{}', maxCount={}", searchKeyword, maxCount);

        try {
            String encodedKeyword = URLEncoder.encode(searchKeyword, StandardCharsets.UTF_8);
            String searchUrl = BASE_URL + "/recipe/list.html?q=" + encodedKeyword;

            // 1. 검색 페이지 접속
            Document searchDoc = Jsoup.connect(searchUrl).timeout(SEARCH_TIMEOUT_MS).get();
            Elements listItems = searchDoc.select(".common_sp_list_ul li");

            log.debug("검색 결과 {} 개 발견", listItems.size());

            int processedCount = 0;
            int videoFilteredCount = 0;

            // 2. 동영상 제외하고 이미지 레시피만 수집
            for (Element item : listItems) {
                if (recipes.size() >= maxCount) {
                    break; // 목표 개수 달성
                }

                try {
                    RecipeCrawlDTO recipe = extractRecipeFromListItem(item);
                    if (recipe == null) {
                        continue; // 파싱 실패
                    }

                    processedCount++;

                    // 동영상 레시피 필터링 (검색 목록에서 미리 체크)
                    if (isVideoRecipeFromListItem(item)) {
                        videoFilteredCount++;
                        log.debug("동영상 레시피 제외: {}", recipe.getTitle());
                        continue;
                    }

                    // 상세 페이지에서 재료 추출
                    List<String> ingredients = crawlIngredients(recipe.getUrl());
                    if (ingredients.isEmpty()) {
                        log.warn("재료 정보 없음, 제외: {}", recipe.getTitle());
                        continue;
                    }

                    recipe.setIngredients(ingredients);
                    recipes.add(recipe);

                    log.debug("레시피 추가: {} (재료 {}개)", recipe.getTitle(), ingredients.size());

                } catch (Exception e) {
                    log.warn("개별 레시피 처리 중 오류: {}", e.getMessage());
                }
            }

            log.info("크롤링 완료: 처리={}, 동영상 제외={}, 성공={}",
                    processedCount, videoFilteredCount, recipes.size());

        } catch (IOException e) {
            log.error("검색 페이지 크롤링 실패: {}", e.getMessage(), e);
        }

        return recipes;
    }

    /**
     * 검색 결과 목록의 개별 항목에서 레시피 기본 정보 추출
     */
    private RecipeCrawlDTO extractRecipeFromListItem(Element item) {
        try {
            RecipeCrawlDTO recipe = new RecipeCrawlDTO();

            // URL 및 제목 추출
            Element link = item.selectFirst(".common_sp_link");
            if (link == null) {
                return null;
            }

            String relativeUrl = link.attr("href");
            recipe.setUrl(BASE_URL + relativeUrl);

            Element titleElement = item.selectFirst(".common_sp_caption_tit");
            if (titleElement != null) {
                recipe.setTitle(titleElement.text().trim());
            }

            // URL에서 레시피 ID 추출
            String[] parts = relativeUrl.split("/");
            if (parts.length > 0) {
                try {
                    recipe.setRecipeId(Long.parseLong(parts[parts.length - 1]));
                } catch (NumberFormatException e) {
                    log.debug("레시피 ID 파싱 실패: {}", relativeUrl);
                }
            }

            // 이미지 URL 추출 (여러 속성 시도)
            Element img = item.selectFirst(".common_sp_thumb img");
            if (img != null) {
                String imgUrl = extractImageUrl(img);
                recipe.setImgUrl(imgUrl);
            }

            return recipe;

        } catch (Exception e) {
            log.debug("레시피 항목 파싱 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * img 요소에서 이미지 URL 추출
     * src, data-src, data-lazy-src 등 여러 속성 확인
     */
    private String extractImageUrl(Element img) {
        // 우선순위: src > data-src > data-lazy-src
        String url = img.attr("src");
        if (url == null || url.isEmpty() || url.contains("placeholder") || url.contains("blank")) {
            url = img.attr("data-src");
        }
        if (url == null || url.isEmpty()) {
            url = img.attr("data-lazy-src");
        }
        return url != null ? url.trim() : "";
    }

    /**
     * 검색 목록 항목에서 동영상 레시피 여부를 빠르게 판단
     * 상세 페이지 접속 없이 목록에서 필터링
     */
    private boolean isVideoRecipeFromListItem(Element item) {
        // 1. 동영상 아이콘/배지 확인
        if (!item.select(".icon_video, .badge_video, [class*=video]").isEmpty()) {
            return true;
        }

        // 2. 제목에 동영상 관련 키워드 확인
        Element titleElement = item.selectFirst(".common_sp_caption_tit");
        if (titleElement != null) {
            String title = titleElement.text().toLowerCase();
            if (title.contains("동영상") || title.contains("영상") || title.contains("video")) {
                return true;
            }
        }

        // 3. 재생 아이콘 오버레이 확인
        if (!item.select(".play_icon, .video_overlay, [class*=play]").isEmpty()) {
            return true;
        }

        return false;
    }

    /**
     * 레시피 상세 페이지에서 재료 정보를 추출하는 메서드
     *
     * @param detailUrl 레시피 상세 페이지 URL
     * @return 재료 이름 리스트 (용량 정보 제거)
     */
    private List<String> crawlIngredients(String detailUrl) {
        List<String> ingredients = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(detailUrl).timeout(DETAIL_TIMEOUT_MS).get();

            // 재료 영역 선택 (만개의레시피 구조)
            Elements ingredientElements = doc.select("#divConfirmedMaterialArea ul li");

            if (ingredientElements.isEmpty()) {
                // 대체 선택자 시도
                ingredientElements = doc.select(".ready_ingre ul li, .ingre_list li");
            }

            for (Element element : ingredientElements) {
                String ingredientName = extractIngredientName(element);
                if (ingredientName != null && !ingredientName.isEmpty()) {
                    ingredients.add(ingredientName);
                }
            }

            log.debug("재료 추출 완료: {} - {}개", detailUrl, ingredients.size());

        } catch (IOException e) {
            log.warn("재료 추출 실패: {} - {}", detailUrl, e.getMessage());
        }

        return ingredients;
    }

    /**
     * 재료 요소에서 재료명 추출 (용량 정보 제거)
     * 예: "양파(1개)" -> "양파"
     */
    private String extractIngredientName(Element element) {
        Element aTag = element.selectFirst("a");
        if (aTag == null) {
            // a 태그가 없으면 텍스트 직접 추출
            String text = element.text().trim();
            if (text.isEmpty()) {
                return null;
            }
            return cleanIngredientName(text);
        }

        String ingredientText = aTag.text().trim();
        if (ingredientText.isEmpty()) {
            return null;
        }

        return cleanIngredientName(ingredientText);
    }

    /**
     * 재료명에서 용량 정보 제거 및 정제
     * 예: "양파(1개)" -> "양파", "소금 약간" -> "소금"
     */
    private String cleanIngredientName(String rawName) {
        if (rawName == null || rawName.isEmpty()) {
            return null;
        }

        String cleaned = rawName.trim();

        // 괄호 안의 용량 정보 제거
        if (cleaned.contains("(")) {
            cleaned = cleaned.substring(0, cleaned.indexOf("(")).trim();
        }

        // "약간", "적당량" 등 불필요한 단어 제거
        cleaned = cleaned.replaceAll("\\s*(약간|적당량|조금)\\s*$", "").trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    /**
     * 기본 크롤링 개수를 5개로 설정하는 오버로드 메소드 (컨트롤러 사용용)
     */
    public List<RecipeCrawlDTO> crawlRecipeDetails(String searchKeyword) {
        return crawlRecipeDetails(searchKeyword, 5);
    }

    /**
     * 에러 발생 시 빈 리스트를 반환하는 Fallback 메서드
     * 통합 추천 서비스에서 사용 (부분 성공 전략)
     */
    public List<RecipeCrawlDTO> crawlRecipeDetailsWithFallback(String searchKeyword, int maxCount) {
        try {
            return crawlRecipeDetails(searchKeyword, maxCount);
        } catch (Exception e) {
            System.err.println("크롤링 실패 (Fallback): " + searchKeyword + " - " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
