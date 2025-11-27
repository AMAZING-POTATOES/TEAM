package org.example.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FoodClassifierService {

    // 🔴 비식품으로 분류할 키워드 목록 (소문자로 통일)
    private static final List<String> NON_FOOD_KEYWORDS = Arrays.asList(
            "세제", "비누", "샴푸", "화장지", "티슈", "물티슈", "수건", "칫솔",
            "마스크", "봉투", "쓰레기", "일회용", "테이프", "건전지", "면도기",
            "가글", "탈취제", "방향제", "종이컵", "빨대", "라이터", "양초"
    );

    private static final Map<String, Integer> EXPIRATION_MAP = Map.ofEntries(
        // 유제품/계란
        Map.entry("우유", 7),
        Map.entry("계란", 14),
        Map.entry("특란", 14),
        Map.entry("치즈", 30),
        Map.entry("요거트", 14),
        // 육류
        Map.entry("삼겹살", 3),
        Map.entry("목우촌", 5),
        Map.entry("소고기", 3),
        Map.entry("돼지고기", 3),
        Map.entry("닭고기", 3),
        Map.entry("단슬", 5),
        // 해산물
        Map.entry("참치", 365),
        Map.entry("생선", 2),
        // 채소
        Map.entry("양배추", 14),
        Map.entry("팽이버섯", 5),
        Map.entry("배추", 14),
        Map.entry("무", 21),
        // 과일
        Map.entry("사과", 14),
        Map.entry("토마토", 7),
        // 가공식품
        Map.entry("두부", 7),
        Map.entry("비빔밥", 365),
        Map.entry("컵반", 365)
    );

    private static final Map<String, String> CATEGORY_MAP = Map.ofEntries(
        // 유제품/계란
        Map.entry("우유", "유제품/계란"),
        Map.entry("계란", "유제품/계란"),
        Map.entry("특란", "유제품/계란"),
        Map.entry("치즈", "유제품/계란"),
        Map.entry("요거트", "유제품/계란"),
        // 육류
        Map.entry("삼겹살", "육류"),
        Map.entry("목우촌", "육류"),
        Map.entry("소고기", "육류"),
        Map.entry("돼지고기", "육류"),
        Map.entry("닭고기", "육류"),
        Map.entry("단슬", "육류"),
        // 해산물
        Map.entry("생선", "해산물"),
        // 채소
        Map.entry("양배추", "채소"),
        Map.entry("팽이버섯", "채소"),
        Map.entry("배추", "채소"),
        Map.entry("무", "채소"),
        // 과일
        Map.entry("사과", "과일"),
        Map.entry("토마토", "과일"),
        // 가공식품
        Map.entry("참치", "가공식품"),
        Map.entry("두부", "가공식품"),
        Map.entry("비빔밥", "가공식품"),
        Map.entry("컵반", "가공식품")
    );

    /**
     * OCR로 파싱된 품목명이 식품인지 비식품인지 판단합니다.
     * @param itemName 파싱된 품목명
     * @return 식품이면 true, 비식품이면 false
     */
    public boolean isFood(String itemName) {
        if (itemName == null || itemName.trim().isEmpty()) {
            return false;
        }

        // 품목명을 소문자화하고 공백을 제거하여 비교합니다.
        String lowerCaseItemName = itemName.toLowerCase().replaceAll("\\s+", "");

        for (String keyword : NON_FOOD_KEYWORDS) {
            if (lowerCaseItemName.contains(keyword)) {
                return false; // 비식품 키워드 포함 시
            }
        }
        return true; // 식품으로 간주
    }

    public Map<String, Object> classifyItem(String name, int quantity, LocalDate receiptDate) {
        String category = "기타";
        int shelfLifeDays = 365;

        for (String keyword : CATEGORY_MAP.keySet()) {
            if (name.contains(keyword)) {
                category = CATEGORY_MAP.get(keyword);
                break;
            }
        }

        for (String keyword : EXPIRATION_MAP.keySet()) {
            if (name.contains(keyword)) {
                shelfLifeDays = EXPIRATION_MAP.get(keyword);
                break;
            }
        }

        LocalDate expireDate = receiptDate.plusDays(shelfLifeDays);

        Map<String, Object> result = new HashMap<>();
        result.put("name", name);
        result.put("quantity", quantity);
        result.put("category", category);
        result.put("purchaseDate", receiptDate.toString());
        result.put("expireDate", expireDate.toString());

        return result;
    }
}


