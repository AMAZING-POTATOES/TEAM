import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUser, getToken, logout as logoutApi } from "../api/auth";

type User = {
  userId: number;
  name: string;
  email: string;
  picture?: string;
} | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  logout: () => void;
  setUser: (user: User) => void;
  mockLogin: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

  // 초기 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (token && storedUser) {
      setUser({
        userId: storedUser.userId,
        name: storedUser.name,
        email: storedUser.email,
        picture: storedUser.picture,
      });
    }

    setLoading(false);
  }, []);

  // localStorage 변경 감지 (다른 탭에서의 로그인/로그아웃)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (!e.newValue) {
          // 토큰 삭제됨 (로그아웃)
          setUser(null);
        } else {
          // 토큰 추가됨 (로그인)
          const storedUser = getUser();
          if (storedUser) {
            setUser({
              userId: storedUser.userId,
              name: storedUser.name,
              email: storedUser.email,
              picture: storedUser.picture,
            });
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const logout = () => {
    logoutApi(); // localStorage에서 토큰 및 사용자 정보 제거
    setUser(null);
    setIsLoginOpen(false);
  };

  const mockLogin = () => {
    if (!USE_MOCK) return;
    const mockUser = {
      userId: 999,
      name: "테스트 사용자",
      email: "test@example.com",
      picture: "",
    };
    setUser(mockUser);
    setIsLoginOpen(false);
  };

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      isLoginOpen,
      openLogin,
      closeLogin,
      logout,
      setUser,
      mockLogin,
    }),
    [user, loading, isLoginOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
