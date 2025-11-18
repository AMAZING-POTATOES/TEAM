package com.proj.food.rottenpotato.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ReceiptOcrService {

    public Map<String, Object> detectReceiptText(String imagePath) throws IOException {
        List<AnnotateImageRequest> requests = new ArrayList<>();

        ByteString imgBytes = ByteString.readFrom(new FileInputStream(imagePath));
        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();

        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse batchResponse = client.batchAnnotateImages(requests);
            AnnotateImageResponse response = batchResponse.getResponses(0);

            // 🧾 디버그용 전체 응답
            System.out.println("🧾 [DEBUG] Vision API 응답: " + response.toString());

            if (response.hasError()) {
                return Map.of("error", response.getError().getMessage());
            }

            // ✅ OCR 결과 텍스트 추출
            StringBuilder sb = new StringBuilder();
            for (EntityAnnotation annotation : response.getTextAnnotationsList()) {
                sb.append(annotation.getDescription()).append("\n");
            }

            String extractedText = sb.toString();
            System.out.println("✅ [DEBUG] 인식된 텍스트:\n" + extractedText);

            // ✅ 영수증 날짜 추출
            LocalDate receiptDate = extractReceiptDate(extractedText);

            return Map.of(
                    "text", extractedText,
                    "receiptDate", receiptDate
            );
        }
    }

    private LocalDate extractReceiptDate(String text) {
        Pattern datePattern = Pattern.compile("(\\d{4}[./-]\\d{2}[./-]\\d{2})");
        Matcher matcher = datePattern.matcher(text);
        if (matcher.find()) {
            String dateStr = matcher.group(1).replace(".", "-").replace("/", "-");
            return LocalDate.parse(dateStr);
        }
        return LocalDate.now(); // fallback
    }
}
