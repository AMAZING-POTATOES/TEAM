package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.service.FoodClassifierService;
import com.proj.food.rottenpotato.service.ReceiptOcrService;
import com.proj.food.rottenpotato.service.ReceiptTextParser;
import com.proj.food.rottenpotato.service.ItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/receipt")
public class ReceiptController {

    private final ReceiptOcrService ocrService;
    private final ReceiptTextParser parser;
    private final FoodClassifierService classifier;
    private final ItemService itemService;

    @Autowired
    public ReceiptController(ReceiptOcrService ocrService, ReceiptTextParser parser,
                             FoodClassifierService classifier, ItemService itemService) {
        this.ocrService = ocrService;
        this.parser = parser;
        this.classifier = classifier;
        this.itemService = itemService;
    }

    @PostMapping("/upload")
    public List<Map<String, Object>> uploadReceipt(@RequestParam("file") MultipartFile file) throws IOException {

        File tempFile = File.createTempFile("receipt-", ".png");
        List<Map<String, Object>> classifiedItems = new ArrayList<>();

        try {
            file.transferTo(tempFile);

            // OCR 실행
            Map<String, Object> ocrResult = ocrService.detectReceiptText(tempFile.getAbsolutePath());
            String text = (String) ocrResult.get("text");
            LocalDate receiptDate = (LocalDate) ocrResult.get("receiptDate");

            if (text == null || text.trim().isEmpty()) {
                return Collections.emptyList();
            }

            // 텍스트 파싱
            List<Map<String, Object>> parsedItems = parser.parseReceipt(text);

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
                Map<String, Object> savedItem = itemService.addItem(classified);
                classifiedItems.add(savedItem);
            }

            return classifiedItems;

        } catch (Exception e) {
            System.err.println("파일 업로드/OCR 파이프라인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("파일 처리 중 오류 발생: " + e.getMessage());
        } finally {
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}
