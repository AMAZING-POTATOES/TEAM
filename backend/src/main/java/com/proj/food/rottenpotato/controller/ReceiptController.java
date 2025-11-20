package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.service.FoodClassifierService;
import com.proj.food.rottenpotato.service.ReceiptOcrService;
import com.proj.food.rottenpotato.service.ReceiptTextParser;
import com.proj.food.rottenpotato.service.ItemService; // ItemService import 추가
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
    private final ItemService itemService; // ItemService 필드 추가

    @Autowired // ItemService를 포함하여 모두 주입
    public ReceiptController(ReceiptOcrService ocrService, ReceiptTextParser parser, FoodClassifierService classifier, ItemService itemService) {
        this.ocrService = ocrService;
        this.parser = parser;
        this.classifier = classifier;
        this.itemService = itemService; // 주입된 ItemService 설정
    }

    /**
     * ✅ 영수증 이미지 업로드 → OCR → 파싱 → 분류 → 재고 저장 (최종 파이프라인)
     */
    @PostMapping("/upload")
    public List<Map<String, Object>> uploadReceipt(@RequestParam("file") MultipartFile file) throws IOException {
        
        File tempFile = File.createTempFile("receipt-", ".png");
        List<Map<String, Object>> classifiedItems = new ArrayList<>();
        
        try {
            file.transferTo(tempFile);

            // 2️⃣ Vision API OCR 수행
            Map<String, Object> ocrResult = ocrService.detectReceiptText(tempFile.getAbsolutePath());
            String text = (String) ocrResult.get("text");
            LocalDate receiptDate = (LocalDate) ocrResult.get("receiptDate");
            
            // 🚨 안전 처리: 텍스트가 없으면 즉시 종료
            if (text == null || text.trim().isEmpty()) {
                return Collections.emptyList();
            }

            // 3️⃣ OCR에서 상품명/수량 파싱
            List<Map<String, Object>> parsedItems = parser.parseReceipt(text);
            
            // 4️⃣ 각 상품을 분류하고 재고에 저장
            for (Map<String, Object> item : parsedItems) {
                String name = (String) item.get("name");
                int quantity = (int) item.get("quantity");
                
                // 4-1. 🛑 비식품 필터링: 비식품이면 건너뛰기
                if (!classifier.isFood(name)) {
                    System.out.println("--- [DEBUG: Filtered] 비식품 항목 건너뜀: " + name);
                    continue; 
                }

                // 4-2. 분류 및 만료일 계산
                Map<String, Object> classified = classifier.classifyItem(name, quantity, receiptDate);
                
                // 4-3. ✅ 재고 서비스에 최종 저장 (임시 메모리 리스트에 저장됨)
                Map<String, Object> savedItem = itemService.addItem(classified);
                classifiedItems.add(savedItem);
            }
            
            // ✅ 결과 반환
            return classifiedItems;

        } catch (Exception e) {
            System.err.println("파일 업로드/OCR 파이프라인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("파일 처리 중 오류 발생: " + e.getMessage());
            
        } finally {
            // 5️⃣ 임시 파일 삭제 보장
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}