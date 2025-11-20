/**
 * 냉장고 재료 관련 API
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// ===== 타입 정의 =====

export interface RefrigeratorItem {
  itemId: number;
  ingredientName: string;
  quantity: string;
  purchaseDate?: string;
  expirationDate?: string;
  storageMethod: 'FRIDGE' | 'FREEZER' | 'ROOM_TEMP';
  status: 'FRESH' | 'NORMAL' | 'WARNING' | 'EXPIRED';
  category?: string;
  memo?: string;
}

export interface RefrigeratorItemRequest {
  ingredientName: string;
  quantity: string;
  purchaseDate?: string;
  expirationDate?: string;
  storageMethod: 'FRIDGE' | 'FREEZER' | 'ROOM_TEMP';
  category?: string;
  memo?: string;
}

export interface ExpiringItem {
  itemId: number;
  ingredientName: string;
  expirationDate: string;
}

// ===== API 함수들 =====

/**
 * 사용자 재료 목록 조회
 */
export const getRefrigeratorItems = async (): Promise<RefrigeratorItem[]> => {
  return apiGet<RefrigeratorItem[]>('/api/refrigerator/items');
};

/**
 * 만료 예정 재료 조회 (3일 내)
 */
export const getExpiringItems = async (): Promise<ExpiringItem[]> => {
  return apiGet<ExpiringItem[]>('/api/refrigerator/items/expiring');
};

/**
 * 재료 상세 조회
 */
export const getRefrigeratorItem = async (itemId: number): Promise<RefrigeratorItem> => {
  return apiGet<RefrigeratorItem>(`/api/refrigerator/items/${itemId}`);
};

/**
 * 재료 추가
 */
export const addRefrigeratorItem = async (
  item: RefrigeratorItemRequest
): Promise<RefrigeratorItem> => {
  return apiPost<RefrigeratorItem>('/api/refrigerator/items', item);
};

/**
 * 재료 수정
 */
export const updateRefrigeratorItem = async (
  itemId: number,
  item: RefrigeratorItemRequest
): Promise<RefrigeratorItem> => {
  return apiPut<RefrigeratorItem>(`/api/refrigerator/items/${itemId}`, item);
};

/**
 * 재료 삭제
 */
export const deleteRefrigeratorItem = async (itemId: number): Promise<void> => {
  return apiDelete<void>(`/api/refrigerator/items/${itemId}`);
};

/**
 * 카테고리별 재료 조회
 */
export const getItemsByCategory = async (category: string): Promise<RefrigeratorItem[]> => {
  return apiGet<RefrigeratorItem[]>(`/api/refrigerator/items/category/${category}`);
};

/**
 * 재료 개수 조회
 */
export const getItemCount = async (): Promise<number> => {
  return apiGet<number>('/api/refrigerator/items/count');
};
