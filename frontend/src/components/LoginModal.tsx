import { useEffect, useRef, useLayoutEffect, useState } from "react";
import type { RefObject, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../app/AuthProvider";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

type LoginModalProps = {
  anchorRef: RefObject<HTMLElement | HTMLButtonElement | null>;
};


export default function LoginModal({ anchorRef }: LoginModalProps) {
  const {closeLogin} = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });
  const googleOauthClientId = import.meta.env.VITE_CLIENT_ID;

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    // TODO: 서버로 credential 전송 및 로그인 처리
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
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
          <div className="flex justify-center mt-5">
            <div className="w-[280px] flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                width="280"
              />
            </div>
          </div>
        </GoogleOAuthProvider>

        <p className="text-[12px] text-slate-400 mt-4 text-center whitespace-nowrap">
          로그인 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
