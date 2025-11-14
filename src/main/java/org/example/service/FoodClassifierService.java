package org.example.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class FoodClassifierService {

    private static final Map<String, Integer> EXPIRATION_MAP = Map.ofEntries(
        Map.entry("우유", 7),
        Map.entry("계란", 14),
        Map.entry("삼겹살", 3),
        Map.entry("참치", 365),
        Map.entry("팽이버섯", 5),
        Map.entry("사과", 14),
        Map.entry("토마토", 7),
        Map.entry("비빔밥", 365),
        Map.entry("컵반", 365)
    );

    private static final Map<String, String> CATEGORY_MAP = Map.ofEntries(
        Map.entry("우유", "유제품/계란"),
        Map.entry("계란", "유제품/계란"),
        Map.entry("삼겹살", "육류"),
        Map.entry("참치", "해산물"),
        Map.entry("팽이버섯", "채소"),
        Map.entry("사과", "과일"),
        Map.entry("토마토", "과일"),
        Map.entry("비빔밥", "가공식품"),
        Map.entry("컵반", "가공식품")
    );

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
        result.put("expireDate", expireDate.toString());

        return result;
    }
}


