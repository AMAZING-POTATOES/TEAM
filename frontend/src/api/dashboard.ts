/**
 * 대시보드 관련 API
 */

import { apiGet } from './apiClient';
import type { RecipeSummary } from './recipe';
import type { ExpiringItem } from './refrigerator';

// ===== 타입 정의 =====

export interface DashboardData {
  popularRecipes: RecipeSummary[];
  recommendedRecipes: RecipeSummary[];
  savedRecipes: RecipeSummary[];
  expiringItems: ExpiringItem[];
  refrigeratorItemCount: number;
}

// ===== API 함수들 =====

/**
 * 대시보드 데이터 조회
 * - 인기 레시피 TOP5
 * - 추천 레시피
 * - 저장한 레시피
 * - 만료 예정 재료
 * - 재료 개수
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  return apiGet<DashboardData>('/api/dashboard');
};
