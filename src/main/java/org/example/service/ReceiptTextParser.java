package org.example.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.*;

@Service
public class ReceiptTextParser {

    public static List<Map<String, Object>> parseReceipt(String text) {
        List<Map<String, Object>> results = new ArrayList<>();

        // 1️⃣ OCR 텍스트 전처리
        String cleaned = text
                .replaceAll("[^ㄱ-ㅎ가-힣0-9a-zA-Z\\s.,()원-]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // 2️⃣ 품목 + 수량 + 금액 패턴 찾기
        // ex) "001 샤인머스캣 1 12990원" 또는 "002 순창청양초쌈장 1 3,200원"
        Pattern itemPattern = Pattern.compile("(\\d{3,4})?\\s*([가-힣a-zA-Z0-9()_\\-\\s]+?)\\s+(\\d+)\\s+([0-9,]+)원");
        Matcher matcher = itemPattern.matcher(cleaned);

        while (matcher.find()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", matcher.group(2).trim());
            item.put("quantity", Integer.parseInt(matcher.group(3)));
            item.put("price", Integer.parseInt(matcher.group(4).replace(",", "")));
            results.add(item);
        }

        return results;
    }
}


