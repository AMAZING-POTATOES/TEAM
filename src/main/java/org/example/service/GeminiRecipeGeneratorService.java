package org.example.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.example.dto.recipe.GeminiRecipeRequest;
import org.example.dto.recipe.GeminiRecipeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Google Gemini API를 사용하여 AI 기반 레시피를 생성하는 서비스
 * Node.js의 geminiService.js를 Java로 변환
 * Rate limiting 및 중복 요청 방지 기능 추가
 */
@Service
public class GeminiRecipeGeneratorService {

    @Value("${google.gemini.api-key}")
    private String apiKey;

    @Value("${google.gemini.model}")
    private String model;

    @Value("${google.gemini.api-url}")
    private String apiUrl;

    private final WebClient webClient;
    private final Gson gson;

    // Rate limiting: 사용자별 마지막 요청 시간 추적
    private final ConcurrentHashMap<String, Long> userLastRequestTime = new ConcurrentHashMap<>();
    private static final long MIN_REQUEST_INTERVAL_MS = 5000; // 5초 최소 간격

    // Request deduplication: 진행 중인 요청 추적
    private final ConcurrentHashMap<String, Boolean> ongoingRequests = new ConcurrentHashMap<>();

    public GeminiRecipeGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.gson = new Gson();
    }

    /**
     * Gemini API를 호출하여 레시피를 생성합니다.
     * Node.js의 generateRecipe() 함수를 Java로 구현
     * Rate limiting 및 중복 요청 방지 기능 포함
     */
    public GeminiRecipeResponse generateRecipe(GeminiRecipeRequest request) {
        // 요청 식별자 생성 (재료 기반)
        String requestKey = generateRequestKey(request);

        try {
            // 1. 중복 요청 체크
            if (ongoingRequests.putIfAbsent(requestKey, Boolean.TRUE) != null) {
                System.out.println("⚠️ 중복 요청 감지 - 요청이 이미 처리 중입니다: " + requestKey);
                return createFallbackResponse(
                    "DUPLICATE_REQUEST",
                    "동일한 요청이 이미 처리 중입니다",
                    "잠시 후 다시 시도해주세요"
                );
            }

            // 2. Rate limiting 체크
            long currentTime = System.currentTimeMillis();
            Long lastRequestTime = userLastRequestTime.get(requestKey);

            if (lastRequestTime != null) {
                long timeSinceLastRequest = currentTime - lastRequestTime;
                if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
                    long waitTime = (MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest) / 1000;
                    System.out.println("⚠️ Rate limit 초과 - " + waitTime + "초 후 다시 시도하세요");

                    // 진행 중 요청 플래그 제거
                    ongoingRequests.remove(requestKey);

                    return createFallbackResponse(
                        "RATE_LIMIT_EXCEEDED",
                        "요청이 너무 빈번합니다",
                        waitTime + "초 후 다시 시도해주세요"
                    );
                }
            }

            // 3. 마지막 요청 시간 업데이트
            userLastRequestTime.put(requestKey, currentTime);

            // 4. 프롬프트 구성
            String prompt = buildPrompt(request);

            // 2. API 요청 바디 구성
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "responseMimeType", "application/json"
                )
            );

            // 3. Gemini API 호출
            System.out.println("🍳 Gemini API 호출 시작...");

            String apiEndpoint = apiUrl + model + ":generateContent?key=" + apiKey;

            String responseBody = webClient.post()
                .uri(apiEndpoint)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // 동기 방식으로 처리

            // 4. 응답 파싱
            JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();

            // Gemini API 응답 구조: candidates[0].content.parts[0].text
            String generatedText = jsonResponse
                .getAsJsonArray("candidates")
                .get(0).getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0).getAsJsonObject()
                .get("text").getAsString();

            // 5. JSON 파싱 (```json 제거)
            String cleanedText = generatedText
                .replace("```json", "")
                .replace("```", "")
                .trim();

            System.out.println("📋 Gemini API 원본 응답:");
            System.out.println(cleanedText);

            // 6. DTO로 변환
            JsonObject parsedData = JsonParser.parseString(cleanedText).getAsJsonObject();

            GeminiRecipeResponse response = new GeminiRecipeResponse();
            response.setSuccess(true);

            // recipe 객체 파싱
            if (parsedData.has("recipe")) {
                GeminiRecipeResponse.RecipeData recipeData = gson.fromJson(
                    parsedData.get("recipe"),
                    GeminiRecipeResponse.RecipeData.class
                );
                response.setRecipe(recipeData);
            }

            // usage_stats 객체 파싱
            if (parsedData.has("usage_stats")) {
                GeminiRecipeResponse.UsageStats usageStats = gson.fromJson(
                    parsedData.get("usage_stats"),
                    GeminiRecipeResponse.UsageStats.class
                );
                response.setUsageStats(usageStats);
            }

            System.out.println("✅ 레시피 생성 성공!");
            return response;

        } catch (WebClientResponseException.TooManyRequests e) {
            // Gemini API Rate Limit 에러 처리
            System.err.println("🚨 Gemini API Rate Limit 초과: " + e.getMessage());
            return createFallbackResponse(
                "API_RATE_LIMIT_EXCEEDED",
                "Gemini API 요청 한도를 초과했습니다",
                "잠시 후 다시 시도해주세요. 새 API 키를 사용하거나 시간을 두고 재시도하세요."
            );
        } catch (Exception e) {
            System.err.println("🚨 Gemini API 오류: " + e.getMessage());
            e.printStackTrace();
            return createFallbackResponse(
                "GENERATION_FAILED",
                "레시피 생성 중 오류 발생",
                e.getMessage()
            );
        } finally {
            // 진행 중 요청 플래그 제거
            ongoingRequests.remove(requestKey);
        }
    }

    /**
     * 요청 식별자 생성 (재료 목록 기반)
     * 동일한 재료 조합은 동일한 키를 가짐
     */
    private String generateRequestKey(GeminiRecipeRequest request) {
        if (request.getIngredients() == null || request.getIngredients().isEmpty()) {
            return "empty";
        }

        // 재료 이름들을 정렬하여 일관된 키 생성
        List<String> ingredientNames = request.getIngredients().stream()
            .map(ing -> ing.getName().toLowerCase().trim())
            .sorted()
            .toList();

        return String.join("_", ingredientNames);
    }

    /**
     * Node.js의 프롬프트를 그대로 Java로 변환
     */
    private String buildPrompt(GeminiRecipeRequest request) {
        String ingredientsJson = gson.toJson(request.getIngredients());
        String preferencesJson = gson.toJson(request.getUserPreferences());

        // 인분 수 동적 처리 (기본값 2)
        Integer targetServingSize = 2;
        if (request.getUserPreferences() != null &&
            request.getUserPreferences().containsKey("serving_size")) {
            targetServingSize = (Integer) request.getUserPreferences().get("serving_size");
        }

        String additionalReq = request.getAdditionalRequirements() != null
            ? request.getAdditionalRequirements()
            : "없음";

        return String.format("""
            # Mission
            You are 'Chef Gemini', a creative master chef specializing in clearing out refrigerators.
            Your task is to generate a single, innovative recipe based on the provided data.

            # Rules
            1. You MUST analyze all provided data: user preferences, ingredients (especially priority_score and days_until_expiry), and additional requirements.
            2. The generated recipe MUST utilize high-priority ingredients effectively to reduce food waste.
            3. The language for all output fields (menu_name, description, etc.) MUST be in Korean.
            4. You MUST respond ONLY with the JSON format specified below.
            5. **CRITICAL**: You MUST fill in ALL fields in the JSON structure. NO null values or missing fields are allowed.
            6. **CRITICAL**: All arrays must contain at least one item. Empty arrays are NOT allowed.
            7. **CRITICAL**: "ingredients_used" MUST ONLY contain ingredients from "Available Ingredients" section above. These are what the user HAS.
            8. **CRITICAL**: "additional_ingredients" MUST ONLY contain NEW ingredients NOT in "Available Ingredients". These are what the user needs to BUY.

            # Input Data: User Preferences
            %s

            # Input Data: Available Ingredients
            %s

            # Input Data: Additional Requirements
            %s

            # Output JSON Format (Strictly follow this structure - ALL fields are REQUIRED)
            {
              "recipe": {
                "menu_name": "창의적인 한글 요리 이름 (REQUIRED)",
                "description": "요리에 대한 간단하고 매력적인 한글 설명 (REQUIRED, 최소 10자 이상)",
                "estimated_cooking_time": 15,
                "difficulty": "EASY",
                "serving_size": %d,
                "ingredients_used": [
                  { "name": "우유", "amount": "200ml", "preparation": "그대로 사용" },
                  { "name": "계란", "amount": "2개", "preparation": "깨뜨려 풀어주기" }
                ],
                "additional_ingredients": [
                  { "name": "소금", "amount": "약간", "note": "간 맞추기용" },
                  { "name": "후추", "amount": "약간", "note": "선택사항" }
                ],
                "cooking_steps": [
                  { "step": 1, "instruction": "첫 번째 조리 단계를 상세히 설명합니다", "time_minutes": 3 },
                  { "step": 2, "instruction": "두 번째 조리 단계를 상세히 설명합니다", "time_minutes": 5 },
                  { "step": 3, "instruction": "세 번째 조리 단계를 상세히 설명합니다", "time_minutes": 7 }
                ],
                "nutritional_info": {
                  "calories_per_serving": 420,
                  "protein": "18g",
                  "carbohydrates": "45g",
                  "fat": "16g"
                },
                "tips": [
                  "요리를 더 맛있게 만들기 위한 팁 1",
                  "요리를 더 맛있게 만들기 위한 팁 2"
                ],
                "safety_warnings": [
                  "조리 시 주의해야 할 안전 사항"
                ]
              },
              "usage_stats": {
                "priority_ingredients_used": 2,
                "total_ingredients_available": 2,
                "waste_reduction_score": 100
              }
            }

            IMPORTANT REMINDER:
            - estimated_cooking_time: MUST be a positive integer (total time in minutes)
            - difficulty: MUST be one of "EASY", "MEDIUM", "HARD"
            - serving_size: MUST be %d (as specified)
            - ALL arrays (ingredients_used, additional_ingredients, cooking_steps, tips, safety_warnings) MUST have at least 1 item
            - cooking_steps: MUST have at least 3 steps with detailed instructions
            - nutritional_info: ALL 4 fields (calories_per_serving, protein, carbohydrates, fat) are REQUIRED
            """,
            preferencesJson,
            ingredientsJson,
            additionalReq,
            targetServingSize,
            targetServingSize
        );
    }

    /**
     * Fallback 응답 생성 함수 (Node.js의 createFallbackResponse 함수)
     */
    private GeminiRecipeResponse createFallbackResponse(String code, String message, String details) {
        GeminiRecipeResponse response = new GeminiRecipeResponse();
        response.setSuccess(false);

        GeminiRecipeResponse.ErrorInfo error = new GeminiRecipeResponse.ErrorInfo(code, message, details);
        response.setError(error);

        // Fallback 제안
        GeminiRecipeResponse.FallbackSuggestion suggestion = new GeminiRecipeResponse.FallbackSuggestion();
        suggestion.setMenuName("달걀프라이와 간장계란밥");
        suggestion.setReason("AI 서버 연결이 불안정하여 가장 실패 없는 레시피를 추천합니다.");
        suggestion.setIngredients(List.of("달걀", "밥", "간장", "참기름"));

        response.setFallbackSuggestions(List.of(suggestion));

        return response;
    }
}
