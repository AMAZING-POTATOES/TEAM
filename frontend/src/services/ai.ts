// AI 생성 레시피 스텁 (나중에 API 연동 예정)
import type { Recipe } from "../lib/recipes";

type GenerateAiRecipeInput = {
  ingredients: string[]; // 선택된 재료 id 또는 name
  prompt?: string;
};

export async function generateAiRecipe(
  input: GenerateAiRecipeInput
): Promise<Recipe> {
  const { ingredients, prompt = "" } = input;

  // 간단 목업: 선택 재료/프롬프트 기반으로 제목/스텝 생성
  const suffix = ingredients.length
    ? ingredients.map((s) => s.replace(/^i-/, "")).join(", ")
    : "추천 재료";

  const title =
    (ingredients[0]?.replace(/^i-/, "") ?? "재료") +
    (prompt ? ` · ${prompt.slice(0, 10)}` : "") +
    " 레시피";

  const recipe: Recipe = {
    id: "ai-" + Date.now().toString(36),
    title,
    category: "양식", // 임시값 (백엔드에서 결정)
    level: "쉬움",
    timeMinutes: 25,
    rating: 4.7,
    ratingCount: 87,
    tags: ["#AI추천", "#창작레시피"],
    ingredients: ingredients.map((idOrName) => ({
      name: idOrName.replace(/^i-/, ""),
      amount: "적당량",
      inStock: true,
    })),
    steps: ["재료 손질", "팬 예열", "볶기", "간 맞추기", "완성"],
    authorName: "AI",
    source: "ai",
    coverUrl: null,
  };

  // API 대기 시뮬레이션
  await new Promise((r) => setTimeout(r, 300));
  return recipe;
}
