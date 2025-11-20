import { useState } from "react";

export type Category = "모두" | "한식" | "중식" | "양식" | "일식" | "디저트" | "기타";
export type Level = "모두" | "쉬움" | "보통" | "어려움";

type Group = { label: string; options: { id: string; name: string }[] };
const GROUPS: Group[] = [
  { label: "채소", options: [{ id: "i-tomato", name: "토마토" }, { id: "i-onion", name: "양파" }, { id: "i-garlic", name: "마늘" }] },
  { label: "육류", options: [{ id: "i-pork", name: "돼지고기" }, { id: "i-chicken", name: "닭가슴살" }] },
  { label: "기타", options: [{ id: "i-spaghetti", name: "스파게티면" }, { id: "i-olive", name: "올리브 오일" }] },
];

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;

  category?: Category;
  onCategoryChange?: (c: Category) => void;
  level?: Level;
  onLevelChange?: (l: Level) => void;
};

export default function IngredientSelector({
  value,
  onChange,
  category = "모두",
  onCategoryChange,
  level = "모두",
  onLevelChange,
}: Props) {
  const [q, setQ] = useState("");

  const CATS: Category[] = ["모두", "한식", "중식", "양식", "일식", "디저트", "기타"];
  const LEVELS: Level[] = ["모두", "쉬움", "보통", "어려움"];

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <aside className="w-[280px] shrink-0">
      <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h4 className="text-lg font-semibold">재료 선택하기</h4>
        <p className="mt-1 text-sm text-gray-500">가지고 있는 재료를 골라보세요.</p>

        {/* 검색 */}
        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="재료 검색…"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
          />
        </div>

        {/* 재료 체크박스 */}
        <div className="mt-5 space-y-5">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div className="mb-2 text-xs font-medium text-gray-500">{g.label}</div>
              <ul className="space-y-2">
                {g.options
                  .filter((o) => o.name.includes(q))
                  .map((o) => (
                    <li key={o.id} className="flex items-center gap-2">
                      <input
                        id={o.id}
                        type="checkbox"
                        checked={value.includes(o.id)}
                        onChange={() => toggle(o.id)}
                        className="size-4 accent-[#4CAF50]"
                      />
                      <label htmlFor={o.id} className="text-sm">
                        {o.name}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 요리종류 */}
        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold">요리종류</div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => onCategoryChange?.(c)}
                className={`rounded-full px-3 py-1 text-sm border ${
                  category === c
                    ? "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 */}
        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold">난이도</div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => onLevelChange?.(l)}
                className={`rounded-full px-3 py-1 text-sm border ${
                  level === l
                    ? "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
