/* 레시피 추천/공유 등 */
package com.proj.food.rottenpotato.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.proj.food.rottenpotato.service.ReceiptOcrService;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/receipt")
public class ReceiptController {

    private final ReceiptOcrService ocrService;

    public ReceiptController(ReceiptOcrService ocrService) {
        this.ocrService = ocrService;
    }

    // 영수증 이미지를 받아 OCR을 수행하고 결과를 반환하는 엔드포인트
    @PostMapping("/upload")
    public String uploadReceipt(@RequestParam("file") MultipartFile file) throws IOException {
        
        // 1. 이미지 파일을 임시로 저장하여 OCR 서비스가 읽을 수 있도록 합니다.
        // 임시 디렉토리를 사용합니다.
        String tempFileName = System.getProperty("java.io.tmpdir") + File.separator + file.getOriginalFilename();
        File tempFile = new File(tempFileName);
        file.transferTo(tempFile);

        try {
            // 2. OCR 서비스 호출 및 텍스트 추출
            String extractedText = ocrService.detectReceiptText(tempFileName);
            
            // 3. OCR 결과 반환
            return "OCR 결과:\n\n" + extractedText;
            
        } finally {
            // 4. 임시 파일 삭제
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}