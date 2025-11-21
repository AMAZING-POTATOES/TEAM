import { useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import LoginModal from "./LoginModal";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    isActive
      ? "text-[#2e7d32] bg-[#4CAF50]/10"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  ].join(" ");
}

function subNavClass({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-lg text-sm",
    isActive
      ? "bg-[#4CAF50]/10 text-[#4CAF50] ring-1 ring-[#4CAF50]/20"
      : "text-gray-600 hover:bg-gray-50",
  ].join(" ");
}

export default function Navbar() {
  const { user, logout, openLogin, isLoginOpen } = useAuth();
  const loginBtnRef = useRef<HTMLButtonElement>(null);
  const nav = useNavigate();
  const { pathname } = useLocation();

  const inRecipes = pathname.startsWith("/recipes");

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-slate-200">

      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between relative">
        <button
          onClick={() => nav("/")}
          className="flex items-center gap-2 shrink-0"
          aria-label="홈으로 이동"
        >
          <img src="/logo.png" alt="싹난감자" className="w-7 h-7 rounded-full" />
          <span className="font-semibold tracking-tight text-slate-900">
            싹난감자
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            대시보드
          </NavLink>
          <NavLink to="/fridge" className={navClass} state={{ from: pathname }}>
            냉장고
          </NavLink>
          <NavLink to="/recipes" className={navClass}>
            레시피
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <button
              ref={loginBtnRef}
              onClick={openLogin}
              className="h-9 px-4 rounded-full bg-[#4CAF50] text-white text-sm hover:opacity-90 active:scale-[.99] transition"
            >
              로그인
            </button>
          ) : (
            <>
              <button
                onClick={() => nav("/mypage")}
                className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 hover:underline"
              >
                {user.name}
              </button>
              <button
                onClick={logout}
                className="h-9 px-3 rounded-full border border-slate-300 text-sm hover:bg-slate-50"
              >
                로그아웃
              </button>
            </>
          )}
        </div>

        {isLoginOpen && <LoginModal anchorRef={loginBtnRef} />}
      </div>

      {inRecipes && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto h-12 px-4 flex items-center gap-2">
            <NavLink to="/recipes" end className={subNavClass}>
              레시피 추천
            </NavLink>
            <NavLink to="/recipes/community" className={subNavClass}>
              레시피 게시판
            </NavLink>
          </div>
        </div>
      )}

      <nav className="md:hidden border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-2 py-2 flex items-center justify-between">
          <NavLink to="/" className={navClass}>
            대시보드
          </NavLink>
          <NavLink to="/fridge" className={navClass} state={{ from: pathname }}>
            냉장고
          </NavLink>
          <NavLink to="/recipes" className={navClass}>
            레시피
          </NavLink>
        </div>
        {inRecipes && (
          <div className="px-2 pb-2 flex gap-2">
            <NavLink to="/recipes" end className={subNavClass}>
              레시피 추천
            </NavLink>
            <NavLink to="/recipes/community" className={subNavClass}>
              레시피 게시판
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
