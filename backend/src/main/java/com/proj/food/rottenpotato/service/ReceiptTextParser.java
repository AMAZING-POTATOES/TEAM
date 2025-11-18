package com.proj.food.rottenpotato.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.*;

@Service
public class ReceiptTextParser {

    public List<Map<String, Object>> parseReceipt(String ocrText) {
        List<Map<String, Object>> results = new ArrayList<>();

        // 불필요한 문자 제거
        String cleaned = ocrText
                .replaceAll("[^ㄱ-ㅎ가-힣0-9a-zA-Z\\s.,:()원-]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // ✅ 3자리 숫자로 시작하는 품목 라인 인식
        Pattern itemPattern = Pattern.compile("\\d{3}\\s*([가-힣a-zA-Z()_\\-\\s]+?)\\s+(\\d+)\\s+[0-9,]+원");
        Matcher matcher = itemPattern.matcher(cleaned);

        while (matcher.find()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", matcher.group(1).trim());
            item.put("quantity", Integer.parseInt(matcher.group(2)));
            results.add(item);
        }

        return results;
    }
}
