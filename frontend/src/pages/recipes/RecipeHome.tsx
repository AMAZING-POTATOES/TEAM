import { useMemo, useRef, useState } from "react";
import IngredientSelector from "../../components/IngredientSelector";
import RecipeFilters from "../../components/RecipeFilters";
import RecipeCard from "../../components/RecipeCard";
import RecipeRating from "../../components/RecipeRating";
import Tag from "../../components/Tag";
import { searchRecipes } from "../../services/recipes";
import { generateAiRecipe } from "../../services/ai";
import type { Recipe } from "../../lib/recipes";

type Mode = "ingredient" | "ai";
type Category = "모두" | "한식" | "중식" | "양식" | "일식" | "디저트" | "기타";
type Level = "모두" | "쉬움" | "보통" | "어려움";

export default function RecipeHome() {

  const [mode, setMode] = useState<Mode>("ingredient");

  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("모두");
  const [level, setLevel] = useState<Level>("모두");
  const [query, setQuery] = useState("");
  const [cookableOnly, setCookableOnly] = useState(false);

  const list = useMemo(
    () =>
      searchRecipes({
        query,
        level,
        category,
        includeOnlyCookable: cookableOnly,
        selectedIngredients: selected,
      }),
    [query, level, category, cookableOnly, selected]
  );

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<Recipe | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const rcp = await generateAiRecipe({
        ingredients: selected,
        prompt,
      });
      setAiRecipe(rcp);
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      );
    } catch (err) {
      console.error(err);
      alert("레시피 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => generate();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header>
        <h1 className="text-[28px] font-bold">내 냉장고 재료로 만드는 레시피</h1>
        <p className="mt-1 text-gray-500">
          가지고 있는 재료를 선택하고 맞춤 레시피를 찾아보세요.
        </p>
      </header>

      <div className="mt-8 flex gap-8">
        <IngredientSelector
          value={selected}
          onChange={setSelected}
          category={category}
          onCategoryChange={setCategory}
          level={level}
          onLevelChange={setLevel}
        />

        <main className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("ingredient")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                mode === "ingredient"
                  ? "bg-[#4CAF50]/10 text-[#4CAF50] ring-1 ring-[#4CAF50]/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              재료 기반 추천
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`rounded-full px-4 py-2 text-sm ${
                mode === "ai"
                  ? "bg-[#4CAF50]/10 text-[#4CAF50] ring-1 ring-[#4CAF50]/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              AI 창작 레시피
            </button>
          </div>

          <div className="mt-4">
            <RecipeFilters
              query={query}
              setQuery={setQuery}
              cookableOnly={cookableOnly}
              setCookableOnly={setCookableOnly}
            />
          </div>

          {mode === "ingredient" ? (
            <>
              <section className="mt-6">
                <h2 className="mb-3 font-semibold">
                  선택한 재료로 만들 수 있는 레시피
                </h2>
                {list.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
                    조건에 맞는 레시피가 없어요. 필터를 조정해보세요.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((r) => (
                      <RecipeCard key={r.id} r={r} />
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-8">
                <div className="rounded-2xl border-2 border-dashed border-[#4CAF50]/30 bg-[#4CAF50]/10 p-8 text-center">
                  <div className="mb-2 font-semibold text-[#4CAF50]">
                    AI가 추천하는 특별한 레시피
                  </div>
                  <p className="text-sm text-[#2e7d32]">
                    선택한 재료로 새롭고 신선한 레시피를 만들어 보세요!
                  </p>
                  <button
                    onClick={() => setMode("ai")}
                    className="mt-4 inline-block rounded-full bg-[#4CAF50] px-5 py-2 text-white hover:opacity-90"
                  >
                    새로운 레시피 생성하기
                  </button>
                </div>
              </section>
            </>
          ) : (
            <>

              <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
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
                    className="rounded-full bg-[#4CAF50] px-5 py-2 text-white hover:opacity-90 disabled:opacity-50"
                    onClick={generate}
                    disabled={loading || selected.length === 0}
                  >
                    {loading ? "생성 중…" : "레시피 생성하기"}
                  </button>
                  <span className="text-sm text-gray-500">
                    선택한 재료 수: {selected.length}개
                  </span>
                </div>
              </section>

              {aiRecipe && (
                <section ref={resultRef} className="mt-8">
                  <div className="flex h-[240px] w-full items-center justify-center rounded-2xl bg-gray-100">
                    <span className="text-3xl">🥗</span>
                  </div>

                  <header className="mt-6">
                    <h3 className="text-[22px] font-bold">{aiRecipe.title}</h3>
                    <div className="mt-2 flex items-center gap-3 text-gray-500">
                      <span>⏱ {aiRecipe.timeMinutes}분</span>
                      <span>•</span>
                      <span>{aiRecipe.level}</span>
                      <span>•</span>
                      <RecipeRating value={aiRecipe.rating ?? 0} />
                      <span className="text-sm text-gray-400">
                        {aiRecipe.ratingCount?.toLocaleString()}명 참여
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aiRecipe.tags.map((t) => (
                        <Tag key={t} text={t} />
                      ))}
                    </div>
                  </header>

                  <section className="mt-6">
                    <h4 className="mb-3 font-semibold">필요한 재료</h4>
                    <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
                      <ul className="divide-y divide-[#4CAF50]/15">
                        {aiRecipe.ingredients.map((i) => (
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
                    <h4 className="mb-3 font-semibold">조리 순서</h4>
                    <ol className="space-y-3">
                      {aiRecipe.steps.map((s, idx) => (
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
                      onClick={regenerate}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
                    >
                      다른 레시피 받아보기
                    </button>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
