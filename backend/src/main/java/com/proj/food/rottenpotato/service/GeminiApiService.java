package com.proj.food.rottenpotato.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GeminiApiService {

    // Node.js 서버의 엔드포인트 URL
    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    public GeminiApiService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Node.js 서버(AI Service)를 호출하여 생성형 레시피를 요청합니다.
     * @param ingredients 사용자가 선택한 재료 목록 (Map 형태로 변환되어야 함)
     * @param userPreferences 사용자 선호도 (예: 맵기, 조리 시간)
     * @return AI가 생성한 레시피 데이터 (JSON Map)
     */
    public Map<String, Object> generateRecipe(List<Map<String, Object>> ingredients, Map<String, Object> userPreferences) {
        
        // 1. Node.js 서버가 기대하는 요청 구조 생성
        Map<String, Object> requestBody = Map.of(
            "ingredients", ingredients,
            "user_preferences", userPreferences
        );
        
        try {
            // 2. HTTP POST 요청 전송
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                aiServiceUrl, 
                requestBody, 
                Map.class // Map 형태로 응답을 직접 받음
            );

            if (response == null || !((Boolean) response.getOrDefault("success", false))) {
                System.err.println("❌ AI 서버 응답 실패 또는 success: false");
                // Node.js 서버의 폴백 응답을 받았다면 그대로 반환
                return response != null ? response : Collections.emptyMap(); 
            }
            
            System.out.println("✅ AI 레시피 생성 성공");
            return response;
            
        } catch (Exception e) {
            System.err.println("🚨 Node.js AI 서버 통신 오류: " + e.getMessage());
            return Collections.emptyMap(); // 통신 실패 시 빈 맵 반환
        }
    }
}