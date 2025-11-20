import { useEffect, useRef, useLayoutEffect, useState } from "react";
import type { RefObject, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../app/AuthProvider";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle, saveToken, saveUser, getToken } from "../api/auth";

type LoginModalProps = {
  anchorRef: RefObject<HTMLElement | HTMLButtonElement | null>;
};


export default function LoginModal({ anchorRef }: LoginModalProps) {
  const { closeLogin, setUser, logout: authLogout } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const googleOauthClientId = import.meta.env.VITE_CLIENT_ID;

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      console.log("Google Login Success:", credentialResponse);

      // Google ID Token 확인
      if (!credentialResponse.credential) {
        throw new Error("Google credential not found");
      }

      // 백엔드로 ID Token 전송
      const response = await loginWithGoogle(credentialResponse.credential);
      console.log("Backend login success:", response);

      // JWT 토큰 저장
      saveToken(response.accessToken);

      // 사용자 정보 저장
      saveUser({
        userId: response.userId,
        email: response.email,
        name: response.name,
        picture: response.picture,
      });

      // AuthProvider 상태 업데이트
      setUser({
        userId: response.userId,
        email: response.email,
        name: response.name,
        picture: response.picture,
      });

      // 인증 상태 업데이트
      setIsAuthenticated(true);

      // 로그인 모달 닫기
      closeLogin();

      // 성공 메시지 (선택사항)
      alert(`환영합니다, ${response.name}님!`);

    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
    alert("Google 로그인에 실패했습니다.");
  };

  const handleLogout = () => {
    authLogout(); // AuthProvider의 logout 호출 (localStorage 정리 + 상태 업데이트)
    setIsAuthenticated(false);
    alert("로그아웃 되었습니다.");
  };

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      const GAP = 8;
      const MODAL_W = 400; 
      const PAD = 8;

      let top = r.bottom + GAP;
      let left = r.left + r.width / 2;

      const minLeft = PAD + MODAL_W / 2;
      const maxLeft = window.innerWidth - PAD - MODAL_W / 2;
      left = Math.max(minLeft, Math.min(maxLeft, left));

      setStyle({
        position: "fixed",
        top,
        left,
        transform: "translateX(-50%)",
        zIndex: 1000,
        visibility: "visible",
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef]);

  
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeLogin();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);

    
  }, [closeLogin]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLogin();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeLogin]);

  // 다른 탭/컴포넌트에서 localStorage 변경 시 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!localStorage.getItem("accessToken"));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const node = (
    <div style={style}>
      <div
        ref={panelRef}
        className="w-[400px] rounded-2xl bg-white border border-gray-200 shadow-xl p-6 relative"
      >
        
        <button
          onClick={closeLogin}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="mx-auto mb-3 size-14 rounded-full bg-green-100 grid place-items-center"></div>
        <h3 className="text-lg font-semibold text-center">싹난감자</h3>
 
        <p className="text-sm text-slate-500 text-center mt-1">
          당신의 냉장고를 위한 똑똑한 파트너
        </p>

        <GoogleOAuthProvider clientId={googleOauthClientId}>
          {isAuthenticated ? (
            <div className="flex flex-col items-center">    
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
              {isLoading && (
                <p className="text-sm text-center text-blue-600 mt-2">
                  로그인 처리 중...
                </p>
              )}
            </div>
          )}
        </GoogleOAuthProvider>

        <p className="text-[12px] text-slate-400 mt-4 text-center whitespace-nowrap">
          로그인 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}