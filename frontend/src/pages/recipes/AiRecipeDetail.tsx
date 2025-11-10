import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Recipe } from "../../lib/recipes";
import { getRecipeById } from "../../services/recipes";

export default function AIRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await getRecipeById(id);
      setRecipe(r);
    })();
  }, [id]);

  if (!recipe)
    return (
      <div className="p-10 text-center text-gray-500">
        레시피를 찾을 수 없습니다.
        <button
          onClick={() => nav(-1)}
          className="mt-4 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          돌아가기
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* 대표 이미지 (비어있을 수 있음) */}
      {recipe.coverUrl ? (
        <img
          src={recipe.coverUrl}
          alt={recipe.title}
          className="w-full h-[320px] rounded-2xl object-cover"
        />
      ) : (
        <div className="w-full h-[320px] rounded-2xl bg-gray-100" />
      )}

      <h1 className="mt-6 text-[28px] font-bold">{recipe.title}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500">
        {recipe.authorName && <span>작성자 {recipe.authorName}</span>}
        <span>⏱ {recipe.timeMinutes}분</span>
        <span>• {recipe.level}</span>
      </div>

      {/* 태그 */}
      {!!recipe.tags.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="inline-flex rounded-full bg-[#4CAF50]/10 px-3 py-1 text-sm text-[#4CAF50]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 재료 */}
      <section className="mt-6">
        <h3 className="font-semibold mb-3">필요한 재료</h3>
        <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
          <ul className="divide-y divide-[#4CAF50]/15">
            {recipe.ingredients.map((i, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between py-3 text-[#2e7d32]"
              >
                <span>{i.name}</span>
                <span>{i.amount ?? "적당량"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 조리 순서 */}
      <section className="mt-8">
        <h3 className="font-semibold mb-3">조리 순서</h3>
        <ol className="space-y-3">
          {recipe.steps.map((s, idx) => (
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
