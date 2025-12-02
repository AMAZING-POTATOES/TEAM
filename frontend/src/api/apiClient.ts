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
      const apiError: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
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
    // ApiError 객체나 Error 인스턴스는 그대로 throw
    if (error && typeof error === 'object' && ('status' in error || error instanceof Error)) {
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

/**
 * OCR 영수증 업로드 및 처리 (진행률 콜백 포함)
 * 백엔드 엔드포인트: POST /receipt/upload
 */
export async function apiUploadReceiptOCR<T>(
  file: File,
  onProgress?: (progress: number, stage: 'upload' | 'recognize' | 'extract') => void
): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/receipt/upload`;

  console.log(`📤 Uploading receipt for OCR: ${file.name}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 업로드 진행률 추적 (0-33%)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const uploadProgress = Math.round((e.loaded / e.total) * 33);
        onProgress(uploadProgress, 'upload');
      }
    });

    // 업로드 완료 후 서버 처리 시작
    xhr.upload.addEventListener('load', () => {
      if (onProgress) {
        onProgress(33, 'upload');
        console.log('✅ Upload complete, starting OCR recognition...');

        // OCR 인식 단계 (33-66%)
        onProgress(40, 'recognize');
        setTimeout(() => onProgress(50, 'recognize'), 500);
        setTimeout(() => onProgress(60, 'recognize'), 1000);
      }
    });

    // 응답 처리
    xhr.addEventListener('load', () => {
      if (xhr.status === 401) {
        removeToken();
        window.location.href = '/';
        reject(new Error('인증이 만료되었습니다. 다시 로그인해주세요.'));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          // 데이터 추출 단계 (66-100%)
          if (onProgress) {
            onProgress(66, 'extract');
            setTimeout(() => onProgress(80, 'extract'), 200);
            setTimeout(() => onProgress(95, 'extract'), 400);
            setTimeout(() => {
              onProgress(100, 'extract');
              console.log('✅ OCR processing complete');
              resolve(data as T);
            }, 600);
          } else {
            console.log('✅ OCR processing complete');
            resolve(data as T);
          }
        } catch (error) {
          reject(new Error('Failed to parse OCR response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          const error: ApiError = {
            message: errorData.message || `HTTP ${xhr.status}: ${xhr.statusText}`,
            status: xhr.status,
          };
          reject(error);
        } catch {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('네트워크 오류가 발생했습니다.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('업로드가 취소되었습니다.'));
    });

    xhr.open('POST', url);

    // 헤더 설정
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(formData);
  });
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  upload: apiUpload,
  uploadReceiptOCR: apiUploadReceiptOCR,
};
