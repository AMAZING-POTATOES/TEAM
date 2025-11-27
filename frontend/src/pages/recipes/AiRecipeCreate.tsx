import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IngredientSelector from "../../components/IngredientSelector";
import type { Category } from "../../components/IngredientSelector";
import { generateAiRecipe } from "../../services/ai";

export default function AIRecipeCreate() {
  const nav = useNavigate();

  // 좌측 사이드바 선택값
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("모두");

  // 프롬프트 & 생성 상태
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // 중복 요청 방지를 위한 ref
  const isGeneratingRef = useRef(false);
  const lastRequestRef = useRef<string>("");

  const onGenerate = async () => {
    // 1. 이미 진행 중인 요청이 있으면 차단
    if (isGeneratingRef.current) {
      console.warn("⚠️ Request already in progress, ignoring duplicate click");
      return;
    }

    // 2. 요청 고유 식별자 생성 (재료 + 프롬프트 해시)
    const requestSignature = JSON.stringify({
      ingredients: selected.sort(),
      prompt: prompt.trim()
    });

    // 3. 동일한 요청이 최근에 있었는지 확인 (중복 방지)
    if (lastRequestRef.current === requestSignature) {
      console.warn("⚠️ Duplicate request detected, ignoring");
      alert("동일한 요청이 이미 처리 중이거나 최근에 처리되었습니다.");
      return;
    }

    // 4. 요청 시작
    isGeneratingRef.current = true;
    lastRequestRef.current = requestSignature;
    setLoading(true);

    try {
      const generatedRecipe = await generateAiRecipe({
        ingredients: selected,
        prompt,
      });

      // RecipeDetail 페이지로 이동
      nav(`/recipes/${generatedRecipe.recipeId}`);
    } catch (e) {
      console.error(e);
      alert("레시피 생성에 실패했어요. 잠시 후 다시 시도해주세요.");

      // 실패 시 중복 요청 방지 해제 (재시도 가능하도록)
      lastRequestRef.current = "";
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
    }
  };

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

          {/* 생성 후 RecipeDetail 페이지로 이동하므로 여기서는 결과를 표시하지 않음 */}
        </main>
      </div>
    </div>
  );
}
