import { useEffect, useState } from "react";
import CommunityCard from "../../components/CommunityCard";
import { listCommunityRecipes } from "../../services/recipes";
import type { Category, Recipe } from "../../lib/recipes";

type Cat = "전체" | Category;
type SortKey = "인기" | "최신";

export default function RecipeCommunity() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("전체");
  const [sort, setSort] = useState<SortKey>("인기");
  const [list, setList] = useState<Recipe[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listCommunityRecipes({ q, category: cat, sort });
      if (mounted) setList(res);
    })();
    return () => {
      mounted = false;
    };
  }, [q, cat, sort]);

  const CATS: Cat[] = ["전체", "한식", "중식", "양식", "일식", "디저트", "기타"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold">레시피 공유</h1>
        <a
          href="/recipes/create"
          className="rounded-full bg-[#4CAF50] px-4 py-2 text-white text-sm hover:opacity-90"
        >
          새 레시피 작성
        </a>
      </div>

      {/* 검색 + 정렬 */}
      <div className="mt-6 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="레시피를 검색해보세요 (e.g., 김치찌개)"
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
          aria-label="정렬"
        >
          <option value="인기">Sort: 인기</option>
          <option value="최신">Sort: 최신</option>
        </select>
      </div>

      {/* 카테고리 칩 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-sm border ${
              cat === c
                ? "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <CommunityCard key={r.id} r={r} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          조건에 맞는 레시피가 없어요. 검색어나 필터를 바꿔보세요.
        </div>
      )}
    </div>
  );
}
