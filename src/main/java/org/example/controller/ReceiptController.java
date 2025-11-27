package org.example.controller;

import org.example.service.FoodClassifierService;
import org.example.service.ReceiptOcrService;
import org.example.service.ReceiptTextParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/receipt")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
public class ReceiptController {

    private final ReceiptOcrService ocrService;
    private final ReceiptTextParser parser;
    private final FoodClassifierService classifier;

    public ReceiptController(ReceiptOcrService ocrService, ReceiptTextParser parser, FoodClassifierService classifier) {
        this.ocrService = ocrService;
        this.parser = parser;
        this.classifier = classifier;
    }

    /**
     * ✅ 영수증 이미지 업로드 → OCR → 파싱 → 분류 → 소비기한 계산
     */
    @PostMapping("/upload")
    public ResponseEntity<List<Map<String, Object>>> uploadReceipt(@RequestParam("file") MultipartFile file) {

        File tempFile = null;
        List<Map<String, Object>> classifiedItems = new ArrayList<>();

        try {
            tempFile = File.createTempFile("receipt-", ".png");
            file.transferTo(tempFile);

            System.out.println("🔵 [START] Receipt upload processing started");

            // OCR 실행
            Map<String, Object> ocrResult = ocrService.detectReceiptText(tempFile.getAbsolutePath());
            String text = (String) ocrResult.get("text");
            LocalDate receiptDate = (LocalDate) ocrResult.get("receiptDate");

            System.out.println("🔵 [OCR] Text extracted, receipt date: " + receiptDate);

            if (text == null || text.trim().isEmpty()) {
                System.out.println("⚠️ [WARNING] Empty OCR text result");
                return ResponseEntity.ok(Collections.emptyList());
            }

            // 텍스트 파싱
            List<Map<String, Object>> parsedItems = ReceiptTextParser.parseReceipt(text);
            System.out.println("🔵 [PARSE] Parsed " + parsedItems.size() + " items");

            // 🔥 중복 품목 자동 합치기
            Map<String, Map<String, Object>> mergedMap = new LinkedHashMap<>();

            for (Map<String, Object> item : parsedItems) {
                String name = (String) item.get("name");
                int quantity = (int) item.get("quantity");

                if (mergedMap.containsKey(name)) {
                    int currentQty = (int) mergedMap.get(name).get("quantity");
                    mergedMap.get(name).put("quantity", currentQty + quantity);
                } else {
                    mergedMap.put(name, new HashMap<>(item));
                }
            }

            List<Map<String, Object>> mergedItems = new ArrayList<>(mergedMap.values());

            System.out.println("=== [DEBUG] Merged Items ===");
            for (Map<String, Object> item : mergedItems) {
                System.out.println(item.get("name") + " x " + item.get("quantity"));
            }
            System.out.println("============================");

            // 분류 후 저장
            for (Map<String, Object> item : mergedItems) {

                String name = (String) item.get("name");
                int quantity = (int) item.get("quantity");

                if (!classifier.isFood(name)) {
                    System.out.println("--- [DEBUG: Filtered] 비식품 항목 건너뜀: " + name);
                    continue;
                }

                Map<String, Object> classified = classifier.classifyItem(name, quantity, receiptDate);
                classifiedItems.add(classified);
            }

            System.out.println("=== [DEBUG] Final Classified Items ===");
            System.out.println("Total items to return: " + classifiedItems.size());
            for (Map<String, Object> item : classifiedItems) {
                System.out.println(item);
            }
            System.out.println("=====================================");

            System.out.println("✅ [SUCCESS] Returning " + classifiedItems.size() + " items to frontend");

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(classifiedItems);

        } catch (Exception e) {
            System.err.println("❌ [ERROR] 파일 업로드/OCR 파이프라인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}


