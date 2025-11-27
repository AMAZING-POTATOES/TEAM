import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDashboardData } from "../api/dashboard";
import type { DashboardData } from "../api/dashboard";
import { useAuth } from "../app/AuthProvider";
import dashboardBannerVideo from "../assets/banner.mp4";
import IntroOverlay from "../components/IntroOverlay";
import receiptEmoji from "../assets/receipt_emoji.png";

export default function Dashboard() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 인트로 표시 여부: 첫 방문 + ?intro=1 이면 무조건 표시
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get("intro") === "1";

    if (forceIntro) {
      return true;
    }

    // 새 버전 키
    const seen = sessionStorage.getItem("sakkan_intro_seen_v2");
    return !seen;
  });

  // 🔹 /?intro=1 로 들어온 경우 인트로 다시 켜기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const forceIntro = params.get("intro") === "1";

    if (forceIntro) {
      setShowIntro(true);
    }
  }, [location.search]);

  const finishIntroCommon = () => {
    sessionStorage.setItem("sakkan_intro_seen_v2", "true");
    setShowIntro(false);

    const params = new URLSearchParams(location.search);
    if (params.get("intro") === "1") {
      nav("/", { replace: true });
    }
  };

  const handleIntroFinishLoggedIn = () => {
    finishIntroCommon();
  };

  const handleIntroFinishLoggedOut = () => {
    finishIntroCommon();
  };

  // 🔹 대시보드 데이터 로드 (백엔드 연동 그대로 유지)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        console.log("🔄 Dashboard: 데이터 로딩 시작...");
        console.log("👤 Dashboard: 현재 사용자:", user);
        setLoading(true);
        setError(null);

        console.log("📡 Dashboard: API 호출 중...");
        const data = await getDashboardData();
        console.log("✅ Dashboard: 데이터 수신 성공:", data);

        setDashboardData(data);
      } catch (err) {
        console.error("❌ Dashboard load failed:", err);
        if (err instanceof Error) {
          console.error("에러 메시지:", err.message);
          console.error("에러 스택:", err.stack);
        }
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다."
        );
      } finally {
        console.log("🏁 Dashboard: 로딩 완료");
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const total = dashboardData?.refrigeratorItemCount ?? 0;
  const expiringSoon = dashboardData?.expiringItems.length ?? 0;
  const popularRecipes = dashboardData?.popularRecipes ?? [];
  const recommendedRecipes = dashboardData?.recommendedRecipes ?? [];

  const expiringRatio =
    total === 0 ? 0 : Math.min(1, expiringSoon / total); // 3일 내 만료 비율

  // 🔹 로딩 상태
  if (loading) {
    return (
      <>
        {showIntro && (
          <IntroOverlay
            isLoggedIn={!!user}
            onFinishLoggedIn={handleIntroFinishLoggedIn}
            onFinishLoggedOut={handleIntroFinishLoggedOut}
          />
        )}
        <div className="min-h-screen grid place-items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-[color:var(--color-primary)] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[color:var(--text-secondary)]">
              데이터를 불러오는 중...
            </p>
          </div>
        </div>
      </>
    );
  }

  // 🔹 에러 상태
  if (error) {
    return (
      <>
        {showIntro && (
          <IntroOverlay
            isLoggedIn={!!user}
            onFinishLoggedIn={handleIntroFinishLoggedIn}
            onFinishLoggedOut={handleIntroFinishLoggedOut}
          />
        )}
        <div className="min-h-screen grid place-items-center">
          <div className="text-center max-w-md px-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">데이터를 불러올 수 없습니다</h2>
            <p className="text-[color:var(--text-secondary)] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-white font-medium hover:opacity-90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🔹 인트로 오버레이 */}
      {showIntro && (
        <IntroOverlay
          isLoggedIn={!!user}
          onFinishLoggedIn={handleIntroFinishLoggedIn}
          onFinishLoggedOut={handleIntroFinishLoggedOut}
        />
      )}

      {/* 🔹 실제 대시보드 내용 */}
      <div>
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* ✅ 오늘 요약 바 */}
          <section>
            <div className="rounded-2xl px-4 py-3 flex flex-wrap gap-3 items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100/70 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                  <span className="text-lg">👋</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-slate-500">
                    오늘 싹난감자가 정리한 냉장고 요약
                  </p>
                  <p className="text-sm md:text-base font-semibold text-emerald-900">
                    {total === 0 ? (
                      <>아직 등록된 재료가 없어요. 첫 영수증을 업로드해 볼까요?</>
                    ) : (
                      <>
                        총 {total}개의 재료 중{" "}
                        <span className="underline decoration-blue-300 decoration-2">
                          {expiringSoon}개
                        </span>
                        가 곧 만료돼요. 지금 바로 활용할 수 있는 레시피{" "}
                        <span className="underline decoration-blue-300 decoration-2">
                          {recommendedRecipes.length}개
                        </span>
                        가 준비되어 있어요.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => nav("/fridge")}
                className="mt-2 md:mt-0 text-xs md:text-sm px-3 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                type="button"
              >
                만료 임박 재료 보러가기
              </button>
            </div>
          </section>

          {/* 상단 배너 비디오 */}
          <section className="rounded-[20px] overflow-hidden bg-black">
            <video
              className="w-full h-auto max-h-[280px] object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={dashboardBannerVideo} type="video/mp4" />
              브라우저가 video 태그를 지원하지 않습니다.
            </video>
          </section>

          {/* 영수증 업로드 CTA */}
          <section
            className="rounded-[20px] p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary-50) 40%, transparent)",
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={receiptEmoji}
                alt="영수증 아이콘"
                className="w-15 h-10 object-contain"
              />
              <div>
                <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-[-0.02em]">
                  영수증으로 간편하게 재고 추가하기
                </h1>
                <p className="text-[color:var(--text-secondary)] mt-1">
                  영수증을 업로드하여 냉장고 속 재료를 한 번에 등록하세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => nav("/upload")}
              className="h-12 px-5 rounded-[12px] text-white font-semibold shadow hover:opacity-95 transition"
              style={{ backgroundColor: "var(--color-primary)" }}
              type="button"
            >
              영수증 업로드
            </button>
          </section>

          {/* 상단 카드 2개 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 총 품목 수 */}
            <div className="rounded-[20px] p-6 bg-[var(--bg-card)] border border-[color:var(--border-soft)] flex items-center gap-4 shadow-sm">
              <div
                className="w-12 h-12 grid place-items-center rounded-full"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary)",
                }}
              >
                📦
              </div>
              <div>
                <div className="text-[color:var(--text-secondary)] text-[15px] font-medium">
                  총 품목 수
                </div>
                <div className="text-[28px] font-bold leading-tight">
                  {total}개
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  냉장고에 보관 중인 전체 재료 개수입니다.
                </p>
              </div>
            </div>

            {/* 3일 내 만료 + 간단 진행 바 */}
            <div className="rounded-[20px] p-6 bg-[var(--bg-card)] border border-[color:var(--border-soft)] flex flex-col justify-center gap-3 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 grid place-items-center rounded-full bg-red-50 text-[color:var(--warn)]">
                  ⏱️
                </div>
                <div>
                  <div className="text-[color:var(--text-secondary)] text-[15px] font-medium">
                    3일 내 만료
                  </div>
                  <div className="text-[28px] font-bold leading-tight">
                    {expiringSoon}개
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>여유 있음</span>
                  <span>위험</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      expiringRatio > 0.6
                        ? "bg-red-400"
                        : expiringRatio > 0.3
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                    style={{
                      width: `${expiringRatio * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 추천 레시피 섹션 */}
          {recommendedRecipes.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[22px] md:text-[24px] font-bold tracking-[-0.01em]">
                  이 재료로 만들 수 있어요! 추천 레시피
                </h2>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <button className="hidden md:inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                    난이도 낮은 순
                  </button>
                  <button
                    onClick={() => nav("/recipes")}
                    className="text-emerald-700 hover:underline"
                    type="button"
                  >
                    전체 보기
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedRecipes.slice(0, 4).map((recipe) => (
                  <div
                    key={recipe.recipeId}
                    onClick={() => nav(`/recipes/${recipe.recipeId}`)}
                    className="rounded-[20px] overflow-hidden bg-[var(--bg-card)] border border-[color:var(--border-soft)] cursor-pointer
                               hover:shadow-lg hover:-translate-y-1 transition-transform transition-shadow duration-200"
                  >
                    <div className="aspect-video bg-slate-100 grid place-items-center text-slate-400 overflow-hidden">
                      {recipe.mainImageUrl ? (
                        <img
                          src={recipe.mainImageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>🍳</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[16px] font-bold truncate">
                          {recipe.title}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="text-[13px] text-[color:var(--text-secondary)] line-clamp-2">
                        {recipe.description ||
                          `${recipe.cookingTime}분 · ${recipe.difficulty}`}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[12px] text-[color:var(--text-secondary)]">
                        <span>👍 {recipe.likeCount}</span>
                        <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 인기 레시피 섹션 */}
          <section className="mt-8">
            <h2 className="text-[22px] md:text-[24px] font-bold tracking-[-0.01em] mb-3">
              지금 인기있는 레시피
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRecipes.length > 0 ? (
                popularRecipes.slice(0, 4).map((recipe) => (
                  <div
                    key={recipe.recipeId}
                    onClick={() => nav(`/recipes/${recipe.recipeId}`)}
                    className="rounded-[20px] overflow-hidden bg-[var(--bg-card)] border border-[color:var(--border-soft)] cursor-pointer
                               hover:shadow-lg hover:-translate-y-1 transition-transform transition-shadow duration-200"
                  >
                    <div className="aspect-video bg-slate-100 grid place-items-center text-slate-400 overflow-hidden">
                      {recipe.mainImageUrl ? (
                        <img
                          src={recipe.mainImageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>🍳</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-[16px] font-bold truncate">
                        {recipe.title}
                      </div>
                      <div className="text-[13px] text-[color:var(--text-secondary)] line-clamp-2">
                        {recipe.description ||
                          `${recipe.cookingTime}분 · ${recipe.difficulty}`}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[12px] text-[color:var(--text-secondary)]">
                        <span>👍 {recipe.likeCount}</span>
                        <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                        <span>👁️ {recipe.viewCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-[color:var(--text-secondary)]">
                  <div className="text-4xl mb-2">🍳</div>
                  <p className="text-lg font-semibold mb-1">
                    아직 등록된 레시피가 없습니다.
                  </p>
                  <p className="text-sm mb-4">
                    오늘 만든 요리를 레시피로 남기고, 인기 레시피로 키워보세요.
                  </p>
                  <button
                    onClick={() => nav("/recipes")}
                    className="mt-1 px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-white font-medium hover:opacity-90"
                    type="button"
                  >
                    레시피 둘러보기
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
