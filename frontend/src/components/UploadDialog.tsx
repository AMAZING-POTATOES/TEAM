import { useEffect, useMemo, useState } from "react";
import { Api, type Category, type FridgeItemDTO } from "../lib/api";

type Draft = {
  name: string;
  category: Category;
  amount: string;
  storage: "냉장" | "냉동" | "실온";
  purchaseDate?: string;
  expireDate?: string;
  memo?: string;
};

export default function UploadDialog({
  open,
  onClose,
  onAddToFridge,
}: {
  open: boolean;
  onClose: () => void;
  onAddToFridge: (items: Omit<FridgeItemDTO, "id">[]) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [classified, setClassified] =
    useState<Record<Category, string[]> | null>(null);
  const [editing, setEditing] = useState<{
    idx: number;
    cat: Category;
    draft: Draft;
  } | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setProgress(0);
      setClassified(null);
      setEditing(null);
      setDrafts([]);
      setError(null);
    }
  }, [open]);

  const onPick = async (f: File) => {
    setFile(f);
    setProgress(0);
    setClassified(null);
    setError(null);
    try {
      const res = await Api.parseReceipt(f, setProgress);
      setClassified(res);

      const today = new Date();
      const toISO = (d: Date) => d.toISOString().slice(0, 10);
      const seven = new Date(today);
      seven.setDate(seven.getDate() + 7);
      const base: Draft[] = [];
      (Object.keys(res) as Category[]).forEach((cat) => {
        res[cat].forEach((name) =>
          base.push({
            name,
            category: cat,
            amount: "1개",
            storage: "냉장",
            purchaseDate: toISO(today),
            expireDate: toISO(seven),
          })
        );
      });
      setDrafts(base);
    } catch (e: any) {
      setError(e.message || "업로드 실패");
    }
  };

  const presentCats = useMemo(() => {
    if (!classified) return [];
    return (Object.keys(classified) as Category[]).filter(
      (c) => classified[c].length > 0
    );
  }, [classified]);

  const updateDraft = (idx: number, patch: Partial<Draft>) =>
    setDrafts((arr) => arr.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const removeDraft = (idx: number) =>
    setDrafts((arr) => arr.filter((_, i) => i !== idx));

  const handleAdd = async () => {
    if (drafts.length === 0) return;
    await onAddToFridge(drafts);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[20px] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">영수증 업로드</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100">
            ✕
          </button>
        </div>

        <label className="block h-44 border-2 border-dashed border-slate-300 rounded-[16px] grid place-items-center text-slate-500 cursor-pointer bg-white">
          <div className="text-center">
            <div className="text-2xl mb-1">⤓</div>
            <div className="font-medium">영수증 이미지를 드래그 앤 드롭</div>
            <div className="text-xs mt-1">또는 클릭하여 파일 선택</div>
          </div>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
            }}
          />
        </label>

        {file && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>{file.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "var(--color-primary)",
                }}
              />
            </div>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>
        )}

        {presentCats.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-sm text-slate-600">
              인식된 항목들을 확인하세요. 잘못된 항목은 ‘수정’으로 바로 고칠 수 있어요.
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-h-[300px] overflow-auto pr-1">
              {presentCats.map((cat) => (
                <div
                  key={cat}
                  className="border border-[color:var(--border-soft)] rounded-[14px] p-4"
                >
                  <div className="font-semibold mb-2">{cat}</div>
                  <ul className="space-y-2">
                    {classified![cat].map((name, i) => {
                      const idx = drafts.findIndex(
                        (d) => d.name === name && d.category === cat
                      );
                      return (
                        // 🔧 여기부터: 텍스트/버튼 레이아웃 수정
                        <li
                          key={`${cat}-${name}-${i}`}
                          className="flex items-center gap-3 text-sm px-3 py-2 rounded-full bg-white border border-[color:var(--border-soft)] max-w-full"
                        >
                          {/* 이름 영역: 남는 폭 전부 사용 + 줄임표 */}
                          <span className="flex-1 min-w-0 truncate text-slate-800">
                            {name}
                          </span>

                          {/* 버튼 영역: 내용 길이에 영향 안 받도록 flex-none */}
                          <div className="flex items-center gap-2 flex-none">
                            <button
                              className="px-2 h-7 rounded-full border border-[color:var(--border-soft)] text-xs"
                              onClick={() =>
                                setEditing({ idx, cat, draft: drafts[idx] })
                              }
                            >
                              수정
                            </button>
                            <button
                              className="px-2 h-7 rounded-full text-xs text-white"
                              style={{ backgroundColor: "var(--warn)" }}
                              onClick={() => removeDraft(idx)}
                            >
                              삭제
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                className={`h-11 px-5 rounded-full text-white ${
                  drafts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={drafts.length === 0}
                style={{ backgroundColor: "var(--color-primary)" }}
                onClick={handleAdd}
              >
                냉장고에 추가
              </button>
            </div>
          </div>
        )}

        {editing && (
          <EditItemModal
            draft={editing.draft}
            onClose={() => setEditing(null)}
            onSave={(d) => {
              updateDraft(editing.idx, d);
              setEditing(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditItemModal({
  draft,
  onClose,
  onSave,
}: {
  draft: Draft;
  onClose: () => void;
  onSave: (patch: Partial<Draft>) => void;
}) {
  const [form, setForm] = useState<Draft>(draft);
  const CATS: Category[] = [
    "육류",
    "해산물",
    "채소",
    "과일",
    "유제품/계란",
    "가공식품",
    "기타",
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[16px] p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">품목 수정</div>
          <button
            className="w-8 h-8 rounded-full bg-slate-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <Field label="이름">
            <input
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="수량">
              <input
                className="input"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="보관">
              <select
                className="input"
                value={form.storage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    storage: e.target.value as any,
                  })
                }
              >
                <option>냉장</option>
                <option>냉동</option>
                <option>실온</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="카테고리">
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as any,
                  })
                }
              >
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="메모">
              <input
                className="input"
                value={form.memo || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    memo: e.target.value,
                  })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="구매일">
              <input
                type="date"
                className="input"
                value={form.purchaseDate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    purchaseDate: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="소비기한">
              <input
                type="date"
                className="input"
                value={form.expireDate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expireDate: e.target.value,
                  })
                }
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            className="px-4 h-10 rounded-full border border-[color:var(--border-soft)]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 h-10 rounded-full text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
            onClick={() => onSave(form)}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}
