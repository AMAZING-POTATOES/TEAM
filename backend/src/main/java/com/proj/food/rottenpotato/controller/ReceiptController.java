package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.service.FoodClassifierService;
import com.proj.food.rottenpotato.service.ReceiptOcrService;
import com.proj.food.rottenpotato.service.ReceiptTextParser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    public ReceiptController(ReceiptOcrService ocrService, ReceiptTextParser parser, FoodClassifierService classifier) {
        this.ocrService = ocrService;
        this.parser = parser;
        this.classifier = classifier;
    }

    /**
     * ✅ 영수증 이미지 업로드 → OCR → 파싱 → 분류 → 소비기한 계산
     */
    @PostMapping("/upload")
    public List<Map<String, Object>> uploadReceipt(@RequestParam("file") MultipartFile file) throws IOException {
        // 1️⃣ 파일을 임시 저장
        File tempFile = File.createTempFile("receipt-", ".png");
        file.transferTo(tempFile);

        // 2️⃣ Vision API OCR 수행
        Map<String, Object> ocrResult = ocrService.detectReceiptText(tempFile.getAbsolutePath());
        String text = (String) ocrResult.get("text");
        LocalDate receiptDate = (LocalDate) ocrResult.get("receiptDate");

        // 3️⃣ OCR에서 상품명/수량 파싱
        List<Map<String, Object>> parsedItems = parser.parseReceipt(text);

        // 4️⃣ 각 상품을 분류하고 소비기한 계산
        List<Map<String, Object>> classifiedItems = new ArrayList<>();
        for (Map<String, Object> item : parsedItems) {
            String name = (String) item.get("name");
            int quantity = (int) item.get("quantity");

            Map<String, Object> classified = classifier.classifyItem(name, quantity, receiptDate);
            classifiedItems.add(classified);
        }

        // 5️⃣ 임시 파일 삭제
        tempFile.delete();

        // ✅ 결과 반환
        return classifiedItems;
    }
}
