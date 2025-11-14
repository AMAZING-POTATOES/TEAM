package org.example.service;

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

    /**
     * Google Vision API를 사용해 영수증에서 텍스트를 추출 (하이브리드 방식)
     */
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

            if (response.hasError()) {
                return Map.of("error", response.getError().getMessage());
            }

            List<EntityAnnotation> annotations = response.getTextAnnotationsList();
            if (annotations.isEmpty()) {
                return Map.of("text", "", "receiptDate", LocalDate.now());
            }

            String reconstructedText;
            try {
                reconstructedText = reconstructTextByCoordinates(annotations);
                // ⚠️ 만약 Vision이 텍스트를 거의 못 인식했다면 전체 텍스트로 fallback
                if (reconstructedText.split("\n").length < 3) {
                    reconstructedText = annotations.get(0).getDescription();
                }
            } catch (Exception e) {
                reconstructedText = annotations.get(0).getDescription();
            }

            System.out.println("🧾 [DEBUG] OCR 재구성 결과:\n" + reconstructedText);

            LocalDate receiptDate = extractReceiptDate(reconstructedText);

            return Map.of(
                    "text", reconstructedText,
                    "receiptDate", receiptDate
            );
        }
    }

    /**
     * Vision API의 좌표 정보를 이용해 줄 단위로 OCR 텍스트 재구성
     */
    private String reconstructTextByCoordinates(List<EntityAnnotation> annotations) {
        List<Map<String, Object>> words = new ArrayList<>();
        for (EntityAnnotation ann : annotations.subList(1, annotations.size())) {
            if (ann.getBoundingPoly().getVerticesCount() >= 1) {
                int y = ann.getBoundingPoly().getVertices(0).getY();
                int x = ann.getBoundingPoly().getVertices(0).getX();
                words.add(Map.of(
                        "text", ann.getDescription(),
                        "y", y,
                        "x", x
                ));
            }
        }

        // y 좌표로 정렬
        words.sort(Comparator.comparingInt(w -> (int) w.get("y")));
        List<List<Map<String, Object>>> lines = new ArrayList<>();
        List<Map<String, Object>> currentLine = new ArrayList<>();
        int prevY = -100;

        for (Map<String, Object> w : words) {
            int y = (int) w.get("y");
            if (Math.abs(y - prevY) > 25) {
                if (!currentLine.isEmpty()) lines.add(new ArrayList<>(currentLine));
                currentLine.clear();
            }
            currentLine.add(w);
            prevY = y;
        }
        if (!currentLine.isEmpty()) lines.add(currentLine);

        // x 좌표 순으로 정렬하여 한 줄씩 문자열 합침
        StringBuilder sb = new StringBuilder();
        for (List<Map<String, Object>> line : lines) {
            line.sort(Comparator.comparingInt(w -> (int) w.get("x")));
            for (Map<String, Object> w : line) {
                sb.append(w.get("text")).append(" ");
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    /**
     * 영수증 상단의 날짜 추출 (예: 2025/10/31, 2025.10.31 등)
     */
    private LocalDate extractReceiptDate(String text) {
        Pattern datePattern = Pattern.compile("(\\d{4}[./-]\\d{2}[./-]\\d{2})");
        Matcher matcher = datePattern.matcher(text);
        if (matcher.find()) {
            String dateStr = matcher.group(1).replace(".", "-").replace("/", "-");
            return LocalDate.parse(dateStr);
        }
        return LocalDate.now();
    }
}


