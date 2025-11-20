// src/services/recipes.ts
import type { Category, Level, Recipe } from "../lib/recipes";
import { MOCK_RECIPES } from "../lib/recipes";

export type SearchOptions = {
  query?: string;
  includeOnlyCookable?: boolean; // 냉장고 재료로 만들 수 있는 것만
  level?: "모두" | Level;
  category?: "모두" | Category;
  selectedIngredients?: string[]; // 선택 재료 id/name (목업은 name 기준 단순 매칭)
};

// 재료기반 검색 (레시피 추천)
export function searchRecipes(opts: SearchOptions = {}): Recipe[] {
  const {
    query = "",
    includeOnlyCookable = false,
    level = "모두",
    category = "모두",
    selectedIngredients = [],
  } = opts;

  const q = query.trim().toLowerCase();
  let list = [...MOCK_RECIPES];

  if (q) {
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (level !== "모두") {
    list = list.filter((r) => r.level === level);
  }
  if (category !== "모두") {
    list = list.filter((r) => r.category === category);
  }
  if (includeOnlyCookable && selectedIngredients.length) {
    // very simple rule: 모든 선택재료가 재료명에 포함되어야 함
    list = list.filter((r) =>
      selectedIngredients.every((sel) =>
        r.ingredients.some(
          (i) =>
            i.name.includes(sel) ||
            (i.id && i.id === sel)
        )
      )
    );
  }
  return list;
}

// 공용 상세 조회 (게시판/추천 동일)
export async function getRecipeById(id: string): Promise<Recipe | null> {
  return MOCK_RECIPES.find((r) => r.id === id) ?? null;
}

// 커뮤니티 목록 (같은 Recipe 사용, source로 필터)
export type CommunityListOptions = {
  q?: string;
  category?: "전체" | Category;
  sort?: "인기" | "최신";
};
export async function listCommunityRecipes(
  opts: CommunityListOptions = {}
): Promise<Recipe[]> {
  const { q = "", category = "전체", sort = "인기" } = opts;
  let arr = MOCK_RECIPES.filter(
    (r) => r.source === "community" || r.source === "external"
  );

  if (category !== "전체") arr = arr.filter((r) => r.category === category);
  if (q.trim()) {
    const k = q.trim().toLowerCase();
    arr = arr.filter(
      (r) =>
        r.title.toLowerCase().includes(k) ||
        (r.authorName ?? "").toLowerCase().includes(k)
    );
  }
  if (sort === "인기") {
    arr.sort(
      (a, b) =>
        (b.likes ?? 0) - (a.likes ?? 0) ||
        (b.comments ?? 0) - (a.comments ?? 0)
    );
  } else {
    // createdAt이 없으니 id 숫자 가정(목업). 실제 DB에서는 createdAt desc
    arr.sort((a, b) => Number(b.id) - Number(a.id));
  }
  return arr;
}
