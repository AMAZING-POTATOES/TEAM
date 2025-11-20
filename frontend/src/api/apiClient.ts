/**
 * API 클라이언트 - 모든 API 요청에 자동으로 JWT 토큰을 포함
 */

import { getToken, removeToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ApiError {
  message: string;
  status: number;
}

/**
 * API 요청을 보내는 공통 함수
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  // 기본 헤더 설정
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // options.headers를 병합
  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
      headers[key] = value;
    });
  }

  // 토큰이 있으면 Authorization 헤더 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  console.log('📝 Headers:', headers);
  console.log('🔑 Token exists:', !!token);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📥 API Response: ${response.status} ${response.statusText}`);

    // 401 Unauthorized - 토큰 만료 또는 잘못된 토큰
    if (response.status === 401) {
      console.error('🚫 인증 실패 (401) - 토큰이 유효하지 않습니다');
      removeToken(); // 토큰 삭제
      // ❌ 리다이렉트 제거 - 무한 루프 방지
      // window.location.href = '/';
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    // 에러 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error ${response.status}:`, errorData);
      const error: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      console.log('✅ 204 No Content');
      return undefined as T;
    }

    // Content-Length가 0이거나 응답 body가 비어있는 경우 처리
    const contentLength = response.headers.get('Content-Length');
    if (contentLength === '0') {
      console.log('✅ Empty response body (Content-Length: 0)');
      return undefined as T;
    }

    // JSON 응답 파싱
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.log('✅ Empty response body');
      return undefined as T;
    }

    const data = JSON.parse(text);
    console.log('✅ API Response Data:', data);
    return data;
  } catch (error) {
    console.error('💥 API Request failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
}

/**
 * GET 요청
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

/**
 * 파일 업로드 (multipart/form-data)
 */
export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {};

  // FormData는 Content-Type을 자동으로 설정하므로 명시하지 않음
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/';
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  return await response.json();
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  upload: apiUpload,
};
