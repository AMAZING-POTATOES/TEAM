/**
 * 레시피 관련 API
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// ===== 타입 정의 =====

export interface RecipeSummary {
  recipeId: number;
  title: string;
  description?: string;
  mainImageUrl?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  cookingTime: number;
  servings?: number;
  category?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  averageRating: number;
  authorName: string;
  createdAt: string;
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: string[] | { tagName: string }[]; // 백엔드가 객체 배열로 보낼 수도 있음
}

export interface RecipeIngredient {
  ingredientName: string;
  quantity: string;
}

export interface RecipeStep {
  stepNumber: number;
  description: string;
}

export interface RecipeCreateRequest {
  title: string;
  description?: string;
  mainImageUrl?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  cookingTime: number;
  servings?: number;
  category?: string;
  ingredients: RecipeIngredient[];
  steps: { description: string }[];
  tags: { tagName: string }[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface RecipeInteractionStatus {
  recipeId: number;
  liked: boolean;
  saved: boolean;
  rating?: number;
}

export interface RecipeComment {
  commentId: number;
  content: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

// ===== API 함수들 =====

/**
 * 최신 레시피 목록 조회
 */
export const getRecipes = async (
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(`/api/recipes?page=${page}&size=${size}`);
};

/**
 * 인기 레시피 조회
 */
export const getPopularRecipes = async (
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(`/api/recipes/popular?page=${page}&size=${size}`);
};

/**
 * 사용자별 레시피 조회
 */
export const getUserRecipes = async (
  userId: number,
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(
    `/api/recipes/user/${userId}?page=${page}&size=${size}`
  );
};

/**
 * 카테고리별 레시피 조회
 */
export const getRecipesByCategory = async (
  category: string,
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(
    `/api/recipes/category/${category}?page=${page}&size=${size}`
  );
};

/**
 * 재료 기반 레시피 검색
 */
export const searchRecipesByIngredient = async (
  ingredient: string
): Promise<RecipeSummary[]> => {
  return apiGet<RecipeSummary[]>(`/api/recipes/search/ingredient?ingredient=${ingredient}`);
};

/**
 * 키워드 검색 (제목/설명)
 */
export const searchRecipesByKeyword = async (
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(
    `/api/recipes/search/keyword?keyword=${keyword}&page=${page}&size=${size}`
  );
};

/**
 * 태그 검색
 */
export const searchRecipesByTag = async (
  tagName: string,
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(
    `/api/recipes/search/tag?tagName=${tagName}&page=${page}&size=${size}`
  );
};

/**
 * 레시피 상세 조회
 */
export const getRecipeDetail = async (recipeId: number): Promise<RecipeDetail> => {
  return apiGet<RecipeDetail>(`/api/recipes/${recipeId}`);
};

/**
 * 레시피 생성
 */
export const createRecipe = async (recipe: RecipeCreateRequest): Promise<RecipeDetail> => {
  return apiPost<RecipeDetail>('/api/recipes', recipe);
};

/**
 * 레시피 수정
 */
export const updateRecipe = async (
  recipeId: number,
  recipe: RecipeCreateRequest
): Promise<RecipeDetail> => {
  return apiPut<RecipeDetail>(`/api/recipes/${recipeId}`, recipe);
};

/**
 * 레시피 삭제
 */
export const deleteRecipe = async (recipeId: number): Promise<void> => {
  return apiDelete<void>(`/api/recipes/${recipeId}`);
};

/**
 * 조회수 증가
 */
export const incrementViewCount = async (recipeId: number): Promise<void> => {
  return apiPost<void>(`/api/recipes/${recipeId}/view`);
};

/**
 * 상호작용 상태 조회 (좋아요/저장/별점 여부)
 */
export const getInteractionStatus = async (
  recipeId: number
): Promise<RecipeInteractionStatus> => {
  return apiGet<RecipeInteractionStatus>(`/api/recipes/${recipeId}/interaction`);
};

/**
 * 냉장고 재료 기반 추천
 */
export const getRecommendations = async (): Promise<RecipeSummary[]> => {
  return apiGet<RecipeSummary[]>('/api/recipes/recommendations');
};

/**
 * 특정 재료 목록 기반 추천
 */
export const getRecommendationsByIngredients = async (
  ingredients: string[]
): Promise<RecipeSummary[]> => {
  return apiPost<RecipeSummary[]>('/api/recipes/recommendations', { ingredients });
};

// ===== 레시피 상호작용 API =====

/**
 * 좋아요 추가
 */
export const likeRecipe = async (recipeId: number): Promise<{ liked: boolean; likeCount: number }> => {
  return apiPost<{ liked: boolean; likeCount: number }>(`/api/recipes/${recipeId}/like`);
};

/**
 * 좋아요 취소
 */
export const unlikeRecipe = async (recipeId: number): Promise<{ liked: boolean; likeCount: number }> => {
  return apiDelete<{ liked: boolean; likeCount: number }>(`/api/recipes/${recipeId}/like`);
};

/**
 * 댓글 목록 조회
 */
export const getComments = async (
  recipeId: number,
  page = 0,
  size = 10
): Promise<PageResponse<RecipeComment>> => {
  return apiGet<PageResponse<RecipeComment>>(
    `/api/recipes/${recipeId}/comments?page=${page}&size=${size}`
  );
};

/**
 * 댓글 작성
 */
export const addComment = async (recipeId: number, content: string): Promise<RecipeComment> => {
  return apiPost<RecipeComment>(`/api/recipes/${recipeId}/comments`, { content });
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  recipeId: number,
  commentId: number,
  content: string
): Promise<RecipeComment> => {
  return apiPut<RecipeComment>(`/api/recipes/${recipeId}/comments/${commentId}`, { content });
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (recipeId: number, commentId: number): Promise<void> => {
  return apiDelete<void>(`/api/recipes/${recipeId}/comments/${commentId}`);
};

/**
 * 별점 등록/수정
 */
export const rateRecipe = async (
  recipeId: number,
  rating: number
): Promise<{ rating: number }> => {
  return apiPost<{ rating: number }>(`/api/recipes/${recipeId}/ratings`, { rating });
};

/**
 * 내 별점 조회
 */
export const getMyRating = async (recipeId: number): Promise<{ rating: number } | null> => {
  return apiGet<{ rating: number } | null>(`/api/recipes/${recipeId}/ratings/me`);
};

/**
 * 레시피 저장
 */
export const saveRecipe = async (recipeId: number): Promise<{ saved: boolean; saveCount: number }> => {
  return apiPost<{ saved: boolean; saveCount: number }>(`/api/recipes/${recipeId}/save`);
};

/**
 * 레시피 저장 취소
 */
export const unsaveRecipe = async (recipeId: number): Promise<{ saved: boolean; saveCount: number }> => {
  return apiDelete<{ saved: boolean; saveCount: number }>(`/api/recipes/${recipeId}/save`);
};

/**
 * 저장한 레시피 목록 조회
 */
export const getSavedRecipes = async (
  page = 0,
  size = 10
): Promise<PageResponse<RecipeSummary>> => {
  return apiGet<PageResponse<RecipeSummary>>(`/api/recipes/saved?page=${page}&size=${size}`);
};
