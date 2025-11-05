import { useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import LoginModal from "./LoginModal";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    isActive
      ? "text-green-700 bg-green-50"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  ].join(" ");
}

export default function Navbar() {
  const { user, logout, openLogin, isLoginOpen } = useAuth();
  const loginBtnRef = useRef<HTMLButtonElement>(null);
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between relative">
        {/* Left: Logo */}
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

        {/* Center: Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            대시보드
          </NavLink>
          <NavLink to="/fridge" className={navClass} state={{ from: loc }}>
            냉장고
          </NavLink>
          <NavLink to="/recipes" className={navClass}>
            레시피
          </NavLink>
        </nav>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              ref={loginBtnRef}
              onClick={openLogin}
              className="h-9 px-4 rounded-full bg-green-600 text-white text-sm hover:bg-green-700 active:scale-[.99] transition"
            >
              로그인
            </button>
          ) : (
            <>
              <span className="hidden sm:block text-sm text-slate-600">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="h-9 px-3 rounded-full border border-slate-300 text-sm hover:bg-slate-50"
              >
                로그아웃
              </button>
            </>
          )}
        </div>

        {/* Login popover anchored to the login button */}
        {isLoginOpen && <LoginModal anchorRef={loginBtnRef} />}
      </div>

      {/* Mobile tabs */}
      <nav className="md:hidden border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-2 py-2 flex items-center justify-between">
          <NavLink to="/" className={navClass}>
            대시보드
          </NavLink>
          <NavLink to="/fridge" className={navClass} state={{ from: loc }}>
            냉장고
          </NavLink>
          <NavLink to="/recipes" className={navClass}>
            레시피
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
