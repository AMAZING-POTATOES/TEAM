package org.example.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ReceiptTextParser {

    public static List<Map<String, Object>> parseReceipt(String ocrText) {

        System.out.println("\n==================== RAW OCR TEXT ====================");
        System.out.println(ocrText);
        System.out.println("=======================================================\n");

        List<Map<String, Object>> results = new ArrayList<>();

        if (ocrText == null || ocrText.isEmpty()) {
            return results;
        }

        String[] lines = ocrText.split("\n");

        for (String rawLine : lines) {
            if (rawLine == null) continue;
            String line = rawLine.trim();
            if (line.isEmpty()) continue;

            System.out.println("🔍 [PARSE DEBUG] Processing line: " + line);

            // 바코드(10자리 이상 숫자) 라인은 무시
            if (line.matches("^\\d{10,}$")) {
                System.out.println("   ⏩ Skipped: Barcode");
                continue;
            }

            // 할인 라인 무시
            if (line.contains("할인") || line.contains("쿠폰")) {
                System.out.println("   ⏩ Skipped: Discount");
                continue;
            }

            // 합계 / 결제 / 과세 / 면세 등 이후는 품목이 아니므로 종료
            if (line.contains("상품금액") || line.contains("할인금액") || line.contains("결제대상")
                    || line.contains("합계") || line.contains("총액") || line.contains("결제")
                    || line.contains("과세") || line.contains("면세") || line.contains("부가세")) {
                System.out.println("   ⏹ Stopped: Summary section");
                break;
            }

            // 🔹 품목 번호로 시작하는 라인 처리: "001 * 상품명 1 12,990 원" 형식
            Pattern itemLinePattern = Pattern.compile("^(\\d{3})\\s+(.+)$");
            Matcher itemMatcher = itemLinePattern.matcher(line);
            if (itemMatcher.matches()) {
                String itemNumber = itemMatcher.group(1);
                String restOfLine = itemMatcher.group(2).trim();

                System.out.println("   ✅ Found item #" + itemNumber + ": " + restOfLine);

                // 라인을 공백으로 분리
                String[] parts = restOfLine.split("\\s+");

                if (parts.length < 3) {
                    System.out.println("   ⚠️ Not enough parts, skipping");
                    continue;
                }

                // 이름, 수량, 가격 추출
                StringBuilder nameBuilder = new StringBuilder();
                Integer quantity = null;
                Integer price = null;

                // 뒤에서부터 가격과 수량 찾기
                for (int i = parts.length - 1; i >= 0; i--) {
                    String part = parts[i];

                    // 가격 패턴: 숫자+콤마 (예: 12,990, 1,000)
                    if (price == null && part.matches("\\d{1,3}(,\\d{3})+")) {
                        price = Integer.parseInt(part.replaceAll(",", ""));
                        System.out.println("   💰 Found price: " + price);
                        continue;
                    }

                    // 수량 패턴: 순수 숫자 1-2자리 (1, 2, 10 등)
                    if (quantity == null && part.matches("^\\d{1,2}$")) {
                        int possibleQty = Integer.parseInt(part);
                        if (possibleQty >= 1 && possibleQty <= 99) {
                            quantity = possibleQty;
                            System.out.println("   🔢 Found quantity: " + quantity);
                            continue;
                        }
                    }

                    // 나머지는 이름의 일부
                    if (nameBuilder.length() > 0) {
                        nameBuilder.insert(0, " ");
                    }
                    nameBuilder.insert(0, part);
                }

                // 가격이 없으면 건너뛰기
                if (price == null) {
                    System.out.println("   ⚠️ No price found, skipping");
                    continue;
                }

                // 수량 기본값
                if (quantity == null) {
                    quantity = 1;
                }

                String rawName = nameBuilder.toString().trim();

                // 한글 + 영문 + 숫자만 남기기 (특수문자 제거)
                String cleanedName = rawName.replaceAll("[^가-힣a-zA-Z0-9\\s]", "").trim();
                cleanedName = cleanedName.replaceAll("\\s+", " "); // 중복 공백 제거
                cleanedName = cleanedName.replaceAll("원+$", ""); // 끝의 '원' 제거

                if (cleanedName.length() < 2) {
                    System.out.println("   ⚠️ Name too short: '" + cleanedName + "', skipping");
                    continue;
                }

                Map<String, Object> item = new HashMap<>();
                item.put("name", cleanedName);
                item.put("quantity", quantity);
                item.put("price", price);

                System.out.println("   ✅ [PARSED] " + cleanedName + " | qty=" + quantity + " | price=" + price);

                results.add(item);
            }
        }

        System.out.println("\n🎯 [PARSE RESULT] Total items parsed: " + results.size());
        return results;
    }
}


