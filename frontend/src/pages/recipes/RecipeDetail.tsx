import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Recipe } from "../../lib/recipes";
import { getRecipeById } from "../../services/recipes";
import RecipeRating from "../../components/RecipeRating";
import Tag from "../../components/Tag";

type Tab = "ingredients" | "steps";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [data, setData] = useState<Recipe | null>(null);
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
    (async () => {
      if (!id) return;
      const r = await getRecipeById(id);
      if (mounted) setData(r);
      requestAnimationFrame(() =>
        topRef.current?.scrollIntoView({ behavior: "smooth" })
      );
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

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
    if (!data?.rating) return null;
    return {
      r: data.rating.toFixed(1),
      cnt: data.ratingCount ? data.ratingCount.toLocaleString() : undefined,
    };
  }, [data]);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-gray-500">레시피를 불러오는 중이에요…</p>
        <button
          onClick={() => nav(-1)}
          className="mt-4 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div ref={topRef} className="mx-auto max-w-4xl px-6 py-10">
      {data.coverUrl ? (
        <div className="h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img src={data.coverUrl} alt={data.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-[320px] w-full rounded-2xl bg-gray-100" />
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
          <span>⏱ {data.timeMinutes}분</span>
          <span>•</span>
          <span>{data.level}</span>
          {ratingText && (
            <>
              <span>•</span>
              <RecipeRating value={data.rating ?? 0} />
              {ratingText.cnt && <span className="text-sm text-gray-400">{ratingText.cnt}명 참여</span>}
            </>
          )}
        </div>

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
                  {i.name} {i.inStock ? "(보유)" : ""}
                </span>
                <span className="text-[#2e7d32]">{i.amount ?? "적당량"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={stepsRef} data-observe-id="steps" className="mt-8">
        <h3 className="mb-3 font-semibold">조리 순서</h3>
        <ol className="space-y-3">
          {data.steps.map((s, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50]/15 font-semibold text-[#2e7d32]">
                {idx + 1}
              </span>
              <div className="flex-1 rounded-xl bg-[#4CAF50]/10 px-4 py-3">{s}</div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
