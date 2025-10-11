/* 영수증 스캔 및 텍스트 파싱 */
package com.proj.food.rottenpotato.service; 

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class ReceiptOcrService {

    // application.properties에서 키 파일 경로를 읽어옵니다.
    @Value("${google.cloud.vision.key-path}")
    private String keyPath;

    /**
     * 영수증 이미지 경로를 받아 텍스트를 추출합니다.
     * @param imagePath 로컬에 저장된 이미지 파일 경로
     * @return 추출된 전체 텍스트
     */
    public String detectReceiptText(String imagePath) {
        // 클라이언트가 키 파일을 찾도록 시스템 속성을 설정합니다.
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", keyPath);
        
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            
            // 1. 이미지 로드
            ByteString imgBytes = ByteString.readFrom(new FileInputStream(imagePath));
            Image img = Image.newBuilder().setContent(imgBytes).build();

            // 2. 요청 설정: DOCUMENT_TEXT_DETECTION 및 한국어 힌트
            ImageContext imageContext = ImageContext.newBuilder()
                    .addLanguageHints("ko") // 한국어 OCR 힌트
                    .build();

            Feature feature = Feature.newBuilder()
                    .setType(Feature.Type.DOCUMENT_TEXT_DETECTION) // 문서 최적화 OCR (영수증에 적합)
                    .build();
            
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .setImageContext(imageContext) 
                    .build();

            // 3. API 호출 및 응답 처리
            List<AnnotateImageResponse> response = client.batchAnnotateImages(Arrays.asList(request)).getResponsesList();
            
            if (response.isEmpty() || !response.get(0).hasFullTextAnnotation()) {
                return "텍스트를 감지하지 못했습니다.";
            }

            // 4. 추출된 전체 텍스트 반환
            return response.get(0).getFullTextAnnotation().getText();
            
        } catch (IOException e) {
            e.printStackTrace();
            return "OCR 서비스 호출 중 오류 발생: " + e.getMessage(); 
        }
    }
}