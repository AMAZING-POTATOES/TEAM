import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeDetail, incrementViewCount, type RecipeDetail as RecipeDetailType } from "../../api/recipe";
import { useAuth } from "../../app/AuthProvider";
import RecipeRating from "../../components/RecipeRating";
import Tag from "../../components/Tag";

type Tab = "ingredients" | "steps";

// 난이도 매핑
const difficultyMap: Record<string, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<RecipeDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Tab>("ingredients");

  const topRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const btnIngRef = useRef<HTMLButtonElement>(null);
  const btnStepRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecipe = async () => {
      if (!id) return;

      try {
        console.log("🔄 RecipeDetail: 레시피 로딩 시작...", id);
        console.log("👤 RecipeDetail: 현재 사용자:", user);
        setLoading(true);
        setError(null);

        const recipeId = parseInt(id, 10);

        // 레시피 상세 조회
        const recipe = await getRecipeDetail(recipeId);

        // 조회수 증가
        await incrementViewCount(recipeId).catch(() => {
          console.warn("조회수 증가 실패 (무시)");
        });

        if (mounted) {
          setData(recipe);
          console.log("✅ RecipeDetail: 레시피 수신 성공:", recipe.title);
          requestAnimationFrame(() =>
            topRef.current?.scrollIntoView({ behavior: "smooth" })
          );
        }
      } catch (err) {
        console.error("❌ RecipeDetail: 레시피 로딩 실패:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "레시피를 불러오는데 실패했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      mounted = false;
    };
  }, [id, user]);

  useEffect(() => {
    const ingEl = ingredientsRef.current;
    const stepEl = stepsRef.current;
    if (!ingEl || !stepEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const k = e.target.getAttribute("data-observe-id");
            if (k === "ingredients") setActive("ingredients");
            if (k === "steps") setActive("steps");
          }
        });
      },
      { root: null, threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );
    obs.observe(ingEl);
    obs.observe(stepEl);
    return () => obs.disconnect();
  }, [data]);

  const updateIndicator = () => {
    const wrap = wrapRef.current;
    const ind = indicatorRef.current;
    const target = active === "ingredients" ? btnIngRef.current : btnStepRef.current;
    if (!wrap || !ind || !target) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = target.getBoundingClientRect();

    const pad = 6;
    const height = wrap.clientHeight - pad * 2;
    const width = btnRect.width; // 버튼 너비만큼
    const left = btnRect.left - wrapRect.left;

    ind.style.height = `${height}px`;
    ind.style.width = `${width}px`;
    ind.style.transform = `translateX(${left}px)`;
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [active]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    setTimeout(updateIndicator, 0);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (tab: Tab) => {
    const el = tab === "ingredients" ? ingredientsRef.current : stepsRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(tab);
  };

  const ratingText = useMemo(() => {
    if (!data?.averageRating) return null;
    return {
      r: data.averageRating.toFixed(1),
      cnt: undefined, // 백엔드에서 ratingCount가 없음
    };
  }, [data]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="inline-block w-12 h-12 border-4 border-t-transparent border-[#4CAF50] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">레시피를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">레시피를 불러올 수 없습니다</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#4CAF50] text-white hover:opacity-90"
            >
              다시 시도
            </button>
            <button
              onClick={() => nav(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없음
  if (!data) {
    return null;
  }

  return (
    <div ref={topRef} className="mx-auto max-w-4xl px-6 py-10">
      {data.mainImageUrl ? (
        <div className="h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img src={data.mainImageUrl} alt={data.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-[320px] w-full rounded-2xl bg-gray-100 flex items-center justify-center text-8xl">
          🍳
        </div>
      )}

      <header className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold">{data.title}</h1>
          <button className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
            저장하기
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500">
          {data.authorName && <span>작성자 {data.authorName}</span>}
          {data.authorName && <span>•</span>}
          <span>⏱ {data.cookingTime}분</span>
          <span>•</span>
          <span>{difficultyMap[data.difficulty] || data.difficulty}</span>
          {data.servings && (
            <>
              <span>•</span>
              <span>{data.servings}인분</span>
            </>
          )}
          {ratingText && (
            <>
              <span>•</span>
              <RecipeRating value={data.averageRating ?? 0} />
              {ratingText.cnt && <span className="text-sm text-gray-400">{ratingText.cnt}명 참여</span>}
            </>
          )}
        </div>

        {data.description && (
          <p className="mt-3 text-gray-600">{data.description}</p>
        )}

        {!!data.tags?.length && (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>
        )}
      </header>

      <div
        ref={wrapRef}
        className="relative mt-6 flex items-center rounded-full bg-[#4CAF50]/10 p-[6px] ring-1 ring-[#4CAF50]/20"
      >

        <div
          ref={indicatorRef}
          className="absolute left-0 top-[6px] rounded-full bg-white shadow-md transition-transform duration-300 ease-out will-change-transform"
          aria-hidden
        />

        <button
          ref={btnIngRef}
          onClick={() => scrollTo("ingredients")}
          className={`relative z-[1] flex-1 rounded-full py-2 text-center text-[15px] font-semibold transition-colors ${
            active === "ingredients" ? "text-gray-800" : "text-gray-500 hover:text-[#4CAF50]"
          }`}
        >
          재료
        </button>
        <button
          ref={btnStepRef}
          onClick={() => scrollTo("steps")}
          className={`relative z-[1] flex-1 rounded-full py-2 text-center text-[15px] font-semibold transition-colors ${
            active === "steps" ? "text-gray-800" : "text-gray-500 hover:text-[#4CAF50]"
          }`}
        >
          조리 방법
        </button>
      </div>

      <section ref={ingredientsRef} data-observe-id="ingredients" className="mt-6">
        <h3 className="mb-3 font-semibold">필요한 재료</h3>
        <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
          <ul className="divide-y divide-[#4CAF50]/15">
            {data.ingredients.map((i, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <span className="font-medium text-[#2e7d32]">
                  {i.ingredientName}
                </span>
                <span className="text-[#2e7d32]">{i.quantity || "적당량"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={stepsRef} data-observe-id="steps" className="mt-8">
        <h3 className="mb-3 font-semibold">조리 순서</h3>
        <ol className="space-y-3">
          {data.steps.map((s) => (
            <li key={s.stepNumber} className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50]/15 font-semibold text-[#2e7d32]">
                {s.stepNumber}
              </span>
              <div className="flex-1 rounded-xl bg-[#4CAF50]/10 px-4 py-3">{s.description}</div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
