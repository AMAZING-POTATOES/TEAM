/**
 * 인증 관련 API 호출 함수들
 */

// 백엔드 API URL (환경변수 또는 기본값)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Google 로그인 API 호출
 */
export interface GoogleLoginResponse {
  accessToken: string;
  userId: number;
  email: string;
  name: string;
  picture: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export const loginWithGoogle = async (idToken: string): Promise<GoogleLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Google login failed');
  }

  return response.json();
};

/**
 * JWT 토큰 저장
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

/**
 * JWT 토큰 가져오기
 */
export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * JWT 토큰 삭제 (로그아웃)
 */
export const removeToken = (): void => {
  localStorage.removeItem('accessToken');
};

/**
 * 사용자 정보 저장
 */
export const saveUser = (user: Omit<GoogleLoginResponse, 'accessToken'>): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * 사용자 정보 가져오기
 */
export const getUser = (): Omit<GoogleLoginResponse, 'accessToken'> | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 사용자 정보 삭제
 */
export const removeUser = (): void => {
  localStorage.removeItem('user');
};

/**
 * 로그아웃 (토큰 및 사용자 정보 삭제)
 */
export const logout = (): void => {
  removeToken();
  removeUser();
};