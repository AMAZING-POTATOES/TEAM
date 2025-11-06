package com.proj.food.rottenpotato.service;

import java.util.*;
import java.util.regex.*;

public class ReceiptTextParser {

    public static List<Map<String, Object>> parseReceipt(String ocrText) {
        List<Map<String, Object>> results = new ArrayList<>();

        // 1️⃣ OCR 텍스트 전처리
        String cleaned = ocrText
                .replaceAll("[^ㄱ-ㅎ가-힣0-9a-zA-Z\\s.,:()원-]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // 2️⃣ 품목 + 수량 + 금액 패턴 찾기
        Pattern itemPattern = Pattern.compile("([가-힣a-zA-Z0-9()_\\-\\s]+?)\\s+(\\d+)\\s+([0-9,]+)원");
        Matcher matcher = itemPattern.matcher(cleaned);

        while (matcher.find()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", matcher.group(1).trim());
            item.put("quantity", Integer.parseInt(matcher.group(2)));
            item.put("price", Integer.parseInt(matcher.group(3).replace(",", "")));
            results.add(item);
        }

        return results;
    }
}
