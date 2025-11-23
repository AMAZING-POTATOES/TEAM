// geminiService.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API 키 설정 및 확인
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ 오류: .env 파일에 GEMINI_API_KEY가 없습니다.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 폴백(실패 시) 응답 생성 함수 ---
function createFallbackResponse(code, message, details) {
  return {
    success: false,
    error: {
      code: code,
      message: message,
      details: details
    },
    fallback_suggestions: [
      {
        menu_name: "달걀프라이와 간장계란밥",
        reason: "AI 서버 연결이 불안정하여 가장 실패 없는 레시피를 추천합니다.",
        ingredients: ["달걀", "밥", "간장", "참기름"]
      }
    ]
  };
}

async function generateRecipe(requestData) {
  try {
    // 1. 모델 설정 (JSON 모드 강제)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // 2. 입력 데이터 준비
    const ingredientsJson = JSON.stringify(requestData.ingredients, null, 2);
    const preferencesJson = JSON.stringify(requestData.user_preferences, null, 2);
    
    // 인분 수 동적 처리 (기본값 2)
    const targetServingSize = requestData.user_preferences?.serving_size || 2;

    // 3. 프롬프트 구성
    const prompt = `
    # Mission
    You are 'Chef Gemini', a creative master chef specializing in clearing out refrigerators.
    Your task is to generate a single, innovative recipe based on the provided data.

    # Rules
    1. You MUST analyze all provided data: user preferences, ingredients (especially priority_score and days_until_expiry), and additional requirements.
    2. The generated recipe MUST utilize high-priority ingredients effectively to reduce food waste.
    3. The language for all output fields (menu_name, description, etc.) MUST be in Korean.
    4. You MUST respond ONLY with the JSON format specified below.

    # Input Data: User Preferences
    ${preferencesJson}

    # Input Data: Available Ingredients
    ${ingredientsJson}

    # Input Data: Additional Requirements
    ${requestData.additional_requirements || "없음"}

    # Output JSON Format (Strictly follow this structure)
    {
      "recipe": {
        "menu_name": "창의적인 한글 요리 이름",
        "description": "요리에 대한 간단하고 매력적인 한글 설명",
        "estimated_cooking_time": 15,
        "difficulty": "EASY", 
        "serving_size": ${targetServingSize}, 
        "ingredients_used": [
          { "name": "사용한 재료명", "amount": "사용한 양", "preparation": "손질 방법" }
        ],
        "additional_ingredients": [
          { "name": "추가 필요 재료명", "amount": "필요한 양", "note": "참고" }
        ],
        "cooking_steps": [
          { "step": 1, "instruction": "첫 번째 조리 단계 설명", "time_minutes": 5 }
        ],
        "nutritional_info": {
          "calories_per_serving": 420,
          "protein": "18g",
          "carbohydrates": "45g",
          "fat": "16g"
        },
        "tips": ["요리에 대한 유용한 팁 1"],
        "safety_warnings": ["안전 경고 1"]
      },
      "usage_stats": {
        "priority_ingredients_used": 1,
        "total_ingredients_available": 3,
        "waste_reduction_score": 85
      }
    }
    `;

    // 4. AI 호출
    console.log("🍳 Gemini API 호출 시작...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. JSON 파싱
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    console.log("✅ 레시피 생성 성공!");

    return {
      success: true,
      recipe: parsedData.recipe,
      usage_stats: parsedData.usage_stats
    };

  } catch (error) {
    console.error("🚨 Gemini API 오류:", error);
    return createFallbackResponse(
      "GENERATION_FAILED",
      "레시피 생성 중 오류 발생",
      error.message
    );
  }
}

module.exports = { generateRecipe };