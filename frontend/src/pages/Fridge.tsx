import { useFridge } from "../lib/useFridge";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category, FridgeItemDTO } from "../lib/api";

// 상태 타입
type FreshStatus = "신선" | "임박" | "만료";

// 상태 계산 함수
function getStatus(item: FridgeItemDTO): FreshStatus {
  if (!item.expireDate) return "신선";
  const end = new Date(item.expireDate);
  const today = new Date();
  // 자정 기준 비교(시간 무시)
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "만료";
  if (diffDays <= 3) return "임박";
  return "신선";
}

const CAT_OPTIONS: Category[] = ["육류", "해산물", "채소", "과일", "유제품/계란", "가공식품", "기타"];

export default function Fridge() {
  const { items, loading, err, remove } = useFridge();
  const nav = useNavigate();

  // 필터 상태
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"ALL" | Category>("ALL");
  const [st, setSt] = useState<"ALL" | FreshStatus>("ALL");

  // 필터링된 뷰
  const view = useMemo(() => {
    return items.filter((i) => {
      const matchesQ =
        !q ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.category.includes(q as any);

      const matchesCat = cat === "ALL" || i.category === cat;

      const s = getStatus(i);
      const matchesSt = st === "ALL" || s === st;

      return matchesQ && matchesCat && matchesSt;
    });
  }, [items, q, cat, st]);

  // 상태 뱃지
  const StatusBadge = ({ s }: { s: FreshStatus }) => {
    const tone =
      s === "신선"
        ? "bg-emerald-500"
        : s === "임박"
        ? "bg-orange-500"
        : "bg-red-500";
    return (
      <span className="inline-flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${tone}`} />
        <span className="text-slate-700 text-sm">{s}</span>
      </span>
    );
  };

  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-[26px] md:text-[28px] font-extrabold tracking-[-0.02em]">나의 냉장고</h1>
        <p className="text-[14px] text-slate-500 mt-1">냉장고 속 재료를 확인하고 관리하세요.</p>

        <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm mt-6">
          {/* 필터 바 */}
          <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="재료명 검색…"
                className="h-10 px-3 rounded-full border border-gray-300 w-[200px]"
              />

              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as any)}
                className="h-10 px-3 rounded-full border border-gray-300"
                aria-label="카테고리 필터"
              >
                <option value="ALL">모든 카테고리</option>
                {CAT_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={st}
                onChange={(e) => setSt(e.target.value as any)}
                className="h-10 px-3 rounded-full border border-gray-300"
                aria-label="상태 필터"
              >
                <option value="ALL">모든 상태</option>
                <option value="신선">신선</option>
                <option value="임박">임박(3일 내 만료)</option>
                <option value="만료">만료</option>
              </select>
            </div>

            <button
              onClick={() => nav("/fridge/edit/new")}
              className="px-4 h-10 rounded-full text-white bg-green-600 hover:bg-green-700"
            >
              + 재료 추가
            </button>
          </div>

          {/* 테이블 */}
          <div className="overflow-auto">
            <table className="min-w-[880px] w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">재료명</th>
                  <th className="py-2">수량</th>
                  <th className="py-2">구매일자</th>
                  <th className="py-2">소비기한</th>
                  <th className="py-2">보관방법</th>
                  <th className="py-2">상태</th>
                  <th className="py-2 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      불러오는 중…
                    </td>
                  </tr>
                ) : err ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-red-600">
                      {err}
                    </td>
                  </tr>
                ) : view.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      조건에 맞는 재료가 없습니다.
                    </td>
                  </tr>
                ) : (
                  view.map((it) => {
                    const s = getStatus(it);
                    return (
                      <tr key={it.id} className="border-t border-gray-200">
                        <td className="py-3">{it.name}</td>
                        <td className="py-3">{it.amount}</td>
                        <td className="py-3">{it.purchaseDate || "-"}</td>
                        <td className="py-3">{it.expireDate || "-"}</td>
                        <td className="py-3">{it.storage}</td>
                        <td className="py-3">
                          <StatusBadge s={s} />
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => nav(`/fridge/edit/${it.id}`)}
                              className="px-3 h-8 rounded-full border border-gray-300"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => remove(it.id)}
                              className="px-3 h-8 rounded-full text-white bg-red-500 hover:bg-red-600"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
