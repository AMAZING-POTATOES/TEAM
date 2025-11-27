package org.example.controller;

import org.example.security.JwtUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${file.upload.dir:src/main/resources/img}")
    private String uploadDir;

    @Value("${file.upload.url-prefix:/api/images}")
    private String urlPrefix;

    /**
     * 이미지 파일 업로드 (인증 필요)
     * @param currentUser 현재 인증된 사용자
     * @param file 업로드할 이미지 파일
     * @return 업로드된 파일의 URL
     */
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @AuthenticationPrincipal JwtUserDetails currentUser,
            @RequestParam("file") MultipartFile file) {

        // 인증 확인
        if (currentUser == null) {
            return ResponseEntity.status(401)
                    .body(createErrorResponse("인증이 필요합니다."));
        }

        try {
            // 파일 유효성 검사
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("파일이 비어있습니다."));
            }

            // 파일 타입 검사 (이미지만 허용)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("이미지 파일만 업로드 가능합니다."));
            }

            // 파일 크기 검사 (5MB 제한)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("파일 크기는 5MB를 초과할 수 없습니다."));
            }

            // 업로드 디렉토리 생성
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            // 파일명 생성 (UUID + 원본 확장자)
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            // 파일 저장
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 생성
            String fileUrl = urlPrefix + "/" + fileName;

            // 응답
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("url", fileUrl);
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("success", "false");
        error.put("error", message);
        return error;
    }
}
