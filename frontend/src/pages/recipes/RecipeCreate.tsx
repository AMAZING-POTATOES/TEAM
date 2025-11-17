import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Ingredient = { name: string; amount?: string };
type Step = { text: string };

export default function RecipeCreate() {
  const nav = useNavigate();

  const [fileName, setFileName] = useState<string>("파일 선택된 파일 없음");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingName, setIngName] = useState("");
  const [ingAmount, setIngAmount] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ text: "" }]);

  const [level, setLevel] =
    useState<"선택" | "쉬움" | "보통" | "어려움">("선택");
  const [time, setTime] =
    useState<"선택" | "10분" | "20분" | "30분" | "60분+">("선택");
  const [category, setCategory] =
    useState<"한식" | "중식" | "양식" | "일식" | "디저트" | "기타">("한식");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addIngredient = () => {
    if (!ingName.trim()) return;
    setIngredients([...ingredients, { name: ingName.trim(), amount: ingAmount.trim() }]);
    setIngName("");
    setIngAmount("");
  };

  const addStep = () => setSteps([...steps, { text: "" }]);

  const submit = () => {
    // TODO: API 연결
    alert("작성 완료 (목업)");
    nav("/recipes/community");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 pb-14">
      {/* 상단 여백 ↓ (기존보다 줄임: pt-6) */}
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-[28px] font-bold">새로운 레시피 작성</h1>
      </div>

      <section className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-6">
        <label className="block text-sm font-semibold mb-2">대표 이미지</label>
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 h-40 flex items-center justify-center text-gray-500">
          {fileName}
        </div>
        <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF · 최대 10MB</p>
      </section>

      <section className="mt-8 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-6">
        <label className="block text-sm font-semibold mb-3">필요한 재료</label>

        <div className="flex gap-3">
          <input
            value={ingName}
            onChange={(e) => setIngName(e.target.value)}
            placeholder="재료명 (예: 토마토)"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
          />
          <input
            value={ingAmount}
            onChange={(e) => setIngAmount(e.target.value)}
            placeholder="수량 (예: 200g)"
            className="w-48 rounded-xl border border-gray-200 px-3 py-2"
          />
          <button
            onClick={addIngredient}
            className="rounded-full px-4 py-2 text-sm bg-[#4CAF50] text-white hover:opacity-90"
          >
            재료 추가
          </button>
        </div>

        {ingredients.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-100">
            {ingredients.map((i, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <span className="text-sm">
                  {i.name} {i.amount ? `· ${i.amount}` : ""}
                </span>
                <button
                  onClick={() =>
                    setIngredients(ingredients.filter((_, k) => k !== idx))
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-6">
        <label className="block text-sm font-semibold mb-3">조리 방법</label>

        <ol className="space-y-3">
          {steps.map((s, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50]/15 text-[#2e7d32] font-semibold">
                {idx + 1}
              </span>
              <textarea
                value={s.text}
                onChange={(e) => {
                  const next = [...steps];
                  next[idx].text = e.target.value;
                  setSteps(next);
                }}
                placeholder="조리 순서에 대한 상세를 작성해주세요."
                className="flex-1 min-h-[80px] rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
              />
            </li>
          ))}
        </ol>

        <button
          onClick={addStep}
          className="mt-4 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-4 py-2 text-sm text-[#2e7d32] hover:bg-[#4CAF50]/15"
        >
          단계 추가
        </button>
      </section>

      {/* 난이도/시간/카테고리/태그 */}
      <section className="mt-8 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">난이도</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            >
              <option>선택</option>
              <option>쉬움</option>
              <option>보통</option>
              <option>어려움</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">시간</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            >
              <option>선택</option>
              <option>10분</option>
              <option>20분</option>
              <option>30분</option>
              <option>60분+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            >
              <option>한식</option>
              <option>중식</option>
              <option>양식</option>
              <option>일식</option>
              <option>디저트</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">태그</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="엔터로 추가 (예: #매콤한요리)"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = tagInput.trim();
                    if (!v) return;
                    setTags([...tags, v]);
                    setTagInput("");
                  }
                }}
              />
              <button
                onClick={() => {
                  const v = tagInput.trim();
                  if (!v) return;
                  setTags([...tags, v]);
                  setTagInput("");
                }}
                className="rounded-full bg-[#4CAF50] px-4 py-2 text-white text-sm hover:opacity-90"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-[#4CAF50]/10 text-[#2e7d32] ring-1 ring-[#4CAF50]/20 px-3 py-1 text-xs"
                  >
                    {t}
                    <button
                      onClick={() =>
                        setTags(tags.filter((_, idx) => idx !== i))
                      }
                      className="ml-1 text-[#2e7d32]/70 hover:underline"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button
          onClick={() => nav(-1)}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={submit}
          className="rounded-full bg-[#4CAF50] px-5 py-2 text-white text-sm hover:opacity-90"
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
