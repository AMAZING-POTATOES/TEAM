package com.proj.food.rottenpotato.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ReceiptTextParser {

    public List<Map<String, Object>> parseReceipt(String ocrText) {

        System.out.println("\n==================== RAW OCR TEXT ====================");
        System.out.println(ocrText);
        System.out.println("=======================================================\n");

        List<Map<String, Object>> results = new ArrayList<>();

        if (ocrText == null || ocrText.isEmpty()) {
            return results;
        }

        String[] lines = ocrText.split("\n");

        // 번호(001) + 같은 줄 나머지
        Pattern itemNoPattern = Pattern.compile("^(\\d{3})(.*)$");
        // 수량: 콤마 없는 순수 숫자
        Pattern qtyPattern = Pattern.compile("^\\d+$");
        // 가격: 7,490 / 12,990원 / 7,490占쏙옙 등
        Pattern pricePattern = Pattern.compile("^\\d{1,3}(,\\d{3})+([^0-9].*)?$");

        StringBuilder nameBuilder = null;
        Integer currentQty = null;
        Integer currentPrice = null;
        boolean inItem = false;

        for (String rawLine : lines) {
            if (rawLine == null) continue;
            String line = rawLine.trim();
            if (line.isEmpty()) continue;

            // 바코드(10자리 이상 숫자) 라인은 무시
            if (line.matches("^\\d{10,}$")) continue;

            // 합계 / 결제 / 과세 / 면세 등 이후는 품목이 아니므로 종료
            if (line.contains("상품금액") || line.contains("할인금액") || line.contains("결제대상")
                    || line.contains("합계") || line.contains("총액") || line.contains("결제")
                    || line.contains("과세") || line.contains("면세") || line.contains("부가세")) {

                saveCurrentItem(results, nameBuilder, currentQty, currentPrice);
                inItem = false;
                break;
            }

            // 🔹 품목 번호 + 같은 줄 나머지 (예: "006 *보먹돼_삼겹살")
            Matcher noMatcher = itemNoPattern.matcher(line);
            if (noMatcher.matches()) {
                // 이전 품목 저장
                saveCurrentItem(results, nameBuilder, currentQty, currentPrice);

                inItem = true;
                nameBuilder = new StringBuilder();
                currentQty = null;
                currentPrice = null;

                String tail = noMatcher.group(2).trim();
                if (!tail.isEmpty()) {
                    // 같은 줄에 붙은 이름 부분
                    nameBuilder.append(tail);
                }
                continue;
            }

            if (!inItem) {
                // 아직 품목 시작 전이면 무시
                continue;
            }

            // 🔹 수량 라인 (순수 숫자, 콤마 없음)
            Matcher qMatcher = qtyPattern.matcher(line);
            if (qMatcher.matches()) {
                try {
                    currentQty = Integer.parseInt(line);
                } catch (NumberFormatException ignored) {}
                continue;
            }

            // 🔹 가격 라인 (콤마 있는 숫자 + 선택적 문자)
            Matcher pMatcher = pricePattern.matcher(line);
            if (pMatcher.matches()) {
                try {
                    String numeric = line.replaceAll("[^0-9]", ""); // 숫자만 추출
                    if (!numeric.isEmpty()) {
                        currentPrice = Integer.parseInt(numeric);
                    }
                } catch (NumberFormatException ignored) {}
                continue;
            }

            // 🔹 할인/쿠폰 라인은 이름에서 제외
            if (line.contains("할인") || line.contains("쿠폰")) {
                continue;
            }

            // 🔹 그 외 라인들은 모두 이름의 일부라고 가정
            if (nameBuilder == null) nameBuilder = new StringBuilder(line);
            else nameBuilder.append(" ").append(line);
        }

        // 마지막 품목 저장
        saveCurrentItem(results, nameBuilder, currentQty, currentPrice);

        return results;
    }

    private void saveCurrentItem(List<Map<String, Object>> results,
                                 StringBuilder nameBuilder,
                                 Integer qty,
                                 Integer price) {

        if (nameBuilder == null || nameBuilder.length() == 0) return;
        if (price == null) return; // 가격 없는 항목은 일단 버림

        String rawName = nameBuilder.toString().trim();

        // 한글만 남기기
        String cleanedName = rawName.replaceAll("[^가-힣]", "");
        // 끝에 붙은 '원' 제거 (가격이 섞여 들어온 경우 방지)
        cleanedName = cleanedName.replaceAll("원+$", "");

        if (cleanedName.length() < 2) return;

        int finalQty = (qty != null) ? qty : 1;

        Map<String, Object> item = new HashMap<>();
        item.put("name", cleanedName);
        item.put("quantity", finalQty);
        item.put("price", price);

        System.out.println("--- [DEBUG: Parsed Item] " + cleanedName +
                " | qty=" + finalQty + " | price=" + price);

        results.add(item);
    }
}
