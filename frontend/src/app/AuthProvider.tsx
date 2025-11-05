import React, { createContext, useContext, useMemo, useState } from "react";

type User = { name: string; email: string; avatar?: string } | null;

type AuthCtx = {
  user: User;
  loading?: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  logout: () => void;
  loginWithGoogle: () => void;
  mockLogin: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
  const API = import.meta.env.VITE_API_BASE_URL || "";

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const logout = () => {
    setUser(null);
    // 백엔드 로그아웃 시 필요 시 추가
    // location.href = `${API}/auth/logout`;
  };

  const loginWithGoogle = () => {
    // 백엔드 구글 OAuth 시작점
    window.location.href = `${API}/auth/google?redirect=${encodeURIComponent(
      window.location.origin
    )}`;
  };

  const mockLogin = () => {
    if (!USE_MOCK) return;
    setUser({
      name: "테스트 사용자",
      email: "test@example.com",
      avatar: "",
    });
    setIsLoginOpen(false);
  };

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isLoginOpen,
      openLogin,
      closeLogin,
      logout,
      loginWithGoogle,
      mockLogin,
    }),
    [user, isLoginOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
