/**
 * AI 레시피 생성 서비스
 * 백엔드 AI API와 연동
 */
import { apiPost } from "../api/apiClient";
import type { RecipeDetail } from "../api/recipe";

type GenerateAiRecipeInput = {
  ingredients: string[]; // 선택된 재료
  prompt?: string;
};

/**
 * AI 레시피 생성
 * POST /api/recipes/generate/ai
 */
export async function generateAiRecipe(
  input: GenerateAiRecipeInput
): Promise<RecipeDetail> {
  console.log('🤖 AI Recipe Generation Request:', {
    ingredients: input.ingredients,
    prompt: input.prompt || "",
    ingredientCount: input.ingredients.length
  });

  // 백엔드 GeminiRecipeRequest 형식에 맞게 변환
  const requestBody = {
    ingredients: input.ingredients.map(name => ({
      name: name,
      quantity: "적당량",
      priorityScore: 50,
      daysUntilExpiry: null
    })),
    userPreferences: {},
    additionalRequirements: input.prompt || ""
  };

  console.log('📤 Transformed request body:', requestBody);

  const response = await apiPost<any>(
    '/api/recipes/generate/ai',
    requestBody
  );

  console.log('✅ AI Recipe Generation Success:', response);

  // GeminiRecipeResponse를 RecipeDetail 형식으로 변환
  if (response.success && response.recipe) {
    const geminiRecipe = response.recipe;

    // 백엔드는 snake_case로 응답하므로 올바른 필드명 사용
    const ingredientsUsed = geminiRecipe.ingredients_used || geminiRecipe.ingredientsUsed || [];
    const additionalIngredients = geminiRecipe.additional_ingredients || geminiRecipe.additionalIngredients || [];
    const cookingSteps = geminiRecipe.cooking_steps || geminiRecipe.cookingSteps || [];

    const recipeDetail: RecipeDetail = {
      recipeId: 0, // AI 생성 레시피는 임시 ID
      title: geminiRecipe.menu_name || geminiRecipe.menuName || "AI 레시피",
      description: geminiRecipe.description || "",
      mainImageUrl: undefined,
      difficulty: geminiRecipe.difficulty || "MEDIUM",
      cookingTime: geminiRecipe.estimated_cooking_time || geminiRecipe.estimatedCookingTime || 30,
      servings: geminiRecipe.serving_size || geminiRecipe.servingSize || 2,
      category: "기타",
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      saveCount: 0,
      averageRating: 0,
      authorName: "AI Chef",
      createdAt: new Date().toISOString(),
      ingredients: [
        // 냉장고에 있는 재료 (isAvailable: true)
        ...ingredientsUsed.map((ing: any) => ({
          ingredientName: ing.name,
          quantity: ing.amount || ing.quantity || "적당량",
          isAvailable: true
        })),
        // 추가로 필요한 재료 (isAvailable: false)
        ...additionalIngredients.map((ing: any) => ({
          ingredientName: ing.name,
          quantity: ing.amount || ing.quantity || "적당량",
          isAvailable: false
        }))
      ],
      steps: cookingSteps.map((step: any, index: number) => ({
        stepNumber: step.step || index + 1,
        description: step.instruction || step.description || ""
      })),
      tags: geminiRecipe.tips || []
    };

    console.log('🔄 Transformed to RecipeDetail:', {
      title: recipeDetail.title,
      ingredientsTotal: recipeDetail.ingredients.length,
      ingredientsAvailable: recipeDetail.ingredients.filter(i => i.isAvailable).length,
      ingredientsAdditional: recipeDetail.ingredients.filter(i => !i.isAvailable).length,
      steps: recipeDetail.steps.length
    });

    return recipeDetail;
  }

  throw new Error(response.error?.message || "AI 레시피 생성에 실패했습니다.");
}
