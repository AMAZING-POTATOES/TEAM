import { useRef, useState } from "react";
import IngredientSelector from "../../components/IngredientSelector";
import type { Category } from "../../components/IngredientSelector";
import RecipeRating from "../../components/RecipeRating";
import Tag from "../../components/Tag";
import type { Recipe } from "../../lib/recipes";
import { generateAiRecipe } from "../../services/ai";

export default function AIRecipeCreate() {
  // 좌측 사이드바 선택값
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("모두");

  // 프롬프트 & 생성 상태
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const r = await generateAiRecipe({
        ingredients: selected,
        prompt,
      });
      setRecipe(r);
      // 결과로 스크롤
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      );
    } catch (e) {
      console.error(e);
      alert("레시피 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const onRegenerate = () => onGenerate();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#4CAF50]/10 px-4 py-2 text-[#2e7d32] ring-1 ring-[#4CAF50]/25">
          <span>✨</span>
          <strong>AI 창작 레시피</strong>
        </div>
        <h1 className="mt-3 text-[28px] font-bold">
          재료를 선택하고, 원하는 스타일을 알려주세요
        </h1>
        <p className="mt-1 text-gray-500">
          AI가 선택한 재료로 새로운 레시피를 만들어 드립니다.
        </p>
      </header>

      <div className="mt-6 flex gap-8">
        {/* 좌측: 재료/카테고리 선택 */}
        <IngredientSelector
          value={selected}
          onChange={setSelected}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* 우측: 프롬프트 입력 + 결과 */}
        <main className="flex-1">
          {/* 추가 프롬프트 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <label className="mb-2 block text-sm font-medium">
              추가 프롬프트 (선택)
            </label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
              placeholder="예: 단백질은 높고 칼로리는 낮게, 마늘 향은 약하게"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={onGenerate}
                disabled={loading || selected.length === 0}
                className="rounded-full bg-[#4CAF50] px-5 py-2 text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "생성 중…" : "레시피 생성하기"}
              </button>
              <span className="text-sm text-gray-500">
                선택한 재료 수: {selected.length}개
              </span>
            </div>
          </section>

          {/* 생성 결과: 상세 레이아웃 (이미지 빈 칸) */}
          {recipe && (
            <section ref={resultRef} className="mt-8">
              {/* 대표 이미지 자리(빈 박스) */}
              <div className="flex h-[320px] w-full items-center justify-center rounded-2xl bg-gray-100">
                <span className="text-4xl">🥗</span>
              </div>

              <header className="mt-6">
                <h2 className="text-[26px] font-bold">{recipe.title}</h2>
                <div className="mt-2 flex items-center gap-3 text-gray-500">
                  <span>⏱ {recipe.timeMinutes}분</span>
                  <span>•</span>
                  <span>{recipe.level}</span>
                  <span>•</span>
                  <RecipeRating value={recipe.rating ?? 0} />
                  <span className="text-sm text-gray-400">
                    {recipe.ratingCount?.toLocaleString()}명 참여
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recipe.tags.map((t) => (
                    <Tag key={t} text={t} />
                  ))}
                </div>
              </header>

              <section className="mt-6">
                <h3 className="mb-3 font-semibold">필요한 재료</h3>
                <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
                  <ul className="divide-y divide-[#4CAF50]/15">
                    {recipe.ingredients.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-center justify-between py-3"
                      >
                        <span className="font-medium text-[#2e7d32]">
                          {i.name}
                          {i.amount ? ` · ${i.amount}` : ""}
                        </span>
                        <span className="text-[#2e7d32]">냉장고에 있음</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="mb-3 font-semibold">조리 순서</h3>
                <ol className="space-y-3">
                  {recipe.steps.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50]/15 font-semibold text-[#2e7d32]">
                        {idx + 1}
                      </span>
                      <div className="flex-1 rounded-xl bg-[#4CAF50]/10 px-4 py-3">
                        {s}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-10 text-right">
                <button
                  onClick={onRegenerate}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
                >
                  다른 레시피 받아보기
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
