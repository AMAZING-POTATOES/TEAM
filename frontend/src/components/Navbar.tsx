import { useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import LoginModal from "./LoginModal";
import logo from "../assets/logo.png";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-lg text-base font-medium transition-colors",
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

      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between relative">
        <button
          onClick={() => nav("/dashboard?intro=1")}
          className="flex items-center gap-2 shrink-0"
          aria-label="홈으로 이동"
        >
          <img src={logo} alt="싹난감자" className="w-28 h-8 rounded-full" />
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass}>대시보드</NavLink>
          <NavLink to="/fridge" className={navClass}>냉장고</NavLink>
          <NavLink to="/recipes" className={navClass}>레시피</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <button
              ref={loginBtnRef}
              onClick={openLogin}
              className="h-9 px-4 rounded-full bg-[#4CAF50] text-white text-sm hover:opacity-90"
            >
              로그인
            </button>
          ) : (
            <>
              <button
                onClick={() => nav("/mypage")}
                className="hidden sm:block text-sm text-slate-600 hover:underline"
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

      {/* 레시피 하위 메뉴 */}
      {inRecipes && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto h-12 px-4 flex items-center gap-2">
            <NavLink to="/recipes" end className={subNavClass}>
              레시피 추천
            </NavLink>
            <NavLink to="/recipes/community" className={subNavClass}>
              레시피 게시판
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
