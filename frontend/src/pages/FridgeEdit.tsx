import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useFridge } from "../lib/useFridge";
import type { FridgeItemDTO, Category } from "../lib/api";

const CATS: Category[] = ["육류", "해산물", "채소", "과일", "유제품/계란", "가공식품", "기타"];

type Draft = Omit<FridgeItemDTO, "id">;

export default function FridgeEdit() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { items, update, addBulk } = useFridge();

  const editing = useMemo(
    () => items.find((it) => it.id === id),
    [items, id]
  );

  const [form, setForm] = useState<Draft>({
    name: "",
    amount: "",
    storage: "냉장",
    category: "채소",
    purchaseDate: "",
    expireDate: "",
    memo: "",
  });

  useEffect(() => {
    if (!id || id === "new") return;
    if (!editing) return;
    const { id: _id, ...rest } = editing;

    // 디버깅: 수정 페이지 진입 시 로드된 데이터 확인
    console.log("📝 FridgeEdit - 수정할 아이템 데이터:", {
      id: editing.id,
      category: editing.category,
      memo: editing.memo,
      fullData: editing,
    });

    setForm(rest);
  }, [id, editing]);

  const onChange =
    <K extends keyof Draft>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value as Draft[K] }));
    };

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (id === "new") {
      await addBulk([form]);
    } else if (editing) {
      await update({ ...form, id: editing.id });
    }
    nav("/fridge");
  }

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {id === "new" ? "새 품목 추가" : "품목 정보 수정"}
        </h1>

        <form
          onSubmit={onSave}
          className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">이름</div>
              <input
                value={form.name}
                onChange={onChange("name")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
                placeholder="예) 우유"
                required
              />
            </label>
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">수량</div>
              <input
                value={form.amount}
                onChange={onChange("amount")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
                placeholder="예) 900ml / 10개"
                required
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">보관</div>
              <select
                value={form.storage}
                onChange={onChange("storage")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
              >
                <option value="냉장">냉장</option>
                <option value="냉동">냉동</option>
                <option value="실온">실온</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm text-slate-600 mb-1">카테고리</div>
              <select
                value={form.category}
                onChange={onChange("category")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">구매일</div>
              <input
                type="date"
                value={form.purchaseDate ?? ""}
                onChange={onChange("purchaseDate")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
              />
            </label>
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">소비기한</div>
              <input
                type="date"
                value={form.expireDate ?? ""}
                onChange={onChange("expireDate")}
                className="w-full h-10 px-3 rounded-md border border-gray-300"
              />
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-slate-600 mb-1">메모</div>
            <input
              value={form.memo ?? ""}
              onChange={onChange("memo")}
              className="w-full h-10 px-3 rounded-md border border-gray-300"
              placeholder="선택 사항"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => nav("/fridge")}
              className="px-4 h-10 rounded-full border border-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 h-10 rounded-full text-white bg-green-600 hover:bg-green-700"
            >
              저장
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
