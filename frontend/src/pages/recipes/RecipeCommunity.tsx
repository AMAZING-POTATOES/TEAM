import { useEffect, useState } from "react";
import CommunityCard from "../../components/CommunityCard";
import { getRecipes, getPopularRecipes, searchRecipesByKeyword, getRecipesByCategory, type RecipeSummary } from "../../api/recipe";
import { useAuth } from "../../app/AuthProvider";

type Cat = "전체" | "한식" | "중식" | "양식" | "일식" | "디저트" | "기타";
type SortKey = "인기" | "최신";

export default function RecipeCommunity() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("전체");
  const [sort, setSort] = useState<SortKey>("인기");
  const [list, setList] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecipes = async () => {
      try {
        console.log("🔄 RecipeCommunity: 레시피 로딩 시작...");
        console.log("👤 RecipeCommunity: 현재 사용자:", user);
        setLoading(true);
        setError(null);

        let response;

        // 검색어가 있으면 키워드 검색
        if (q.trim()) {
          response = await searchRecipesByKeyword(q, 0, 100);
        }
        // 카테고리가 선택되어 있으면 카테고리별 조회
        else if (cat !== "전체") {
          response = await getRecipesByCategory(cat, 0, 100);
        }
        // 정렬 기준에 따라 조회
        else if (sort === "인기") {
          response = await getPopularRecipes(0, 100);
        } else {
          response = await getRecipes(0, 100);
        }

        if (mounted) {
          setList(response.content);
          console.log("✅ RecipeCommunity: 레시피 수신 성공:", response.content.length, "개");
        }
      } catch (err) {
        console.error("❌ RecipeCommunity: 레시피 로딩 실패:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "레시피를 불러오는데 실패했습니다.");
          setList([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecipes();

    return () => {
      mounted = false;
    };
  }, [q, cat, sort, user]);

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
          className="flex-1 rounded-full border border-gray-200 px-3 py-2 focus-ring-1 focus-ring-grenn-600"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
          aria-label="정렬"
        >
          <option value="인기">인기</option>
          <option value="최신">최신</option>
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

      {/* 로딩 상태 */}
      {loading && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-transparent border-[#4CAF50] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">레시피를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !loading && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 카드 그리드 */}
      {!loading && !error && list.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <CommunityCard key={r.recipeId} r={r} />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && !error && list.length === 0 && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          조건에 맞는 레시피가 없어요. 검색어나 필터를 바꿔보세요.
        </div>
      )}
    </div>
  );
}
