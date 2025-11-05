import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../app/AuthProvider";

type LoginModalProps = {
  anchorRef: RefObject<HTMLElement | HTMLButtonElement | null>;
};

export default function LoginModal({ anchorRef }: LoginModalProps) {
  const { closeLogin, loginWithGoogle, mockLogin } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

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
        {/* ✅ 서브 카피 추가 */}
        <p className="text-sm text-slate-500 text-center mt-1">
          당신의 냉장고를 위한 똑똑한 파트너
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full h-11 mt-5 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt=""
          />
          Google로 계속하기
        </button>

        {import.meta.env.VITE_USE_MOCK === "true" && (
          <button
            onClick={mockLogin}
            className="w-full h-10 rounded-full mt-3 border border-gray-300 text-sm"
            title="개발용"
          >
            테스트 로그인(모크)
          </button>
        )}

        <p className="text-[12px] text-slate-400 mt-4 text-center whitespace-nowrap">
          로그인 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
