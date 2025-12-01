import { useFridge } from "../lib/useFridge";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category, FridgeItemDTO } from "../lib/api";
import fridgeEmoji from "../assets/fridge_emoji.png";

type FreshStatus = "신선" | "임박" | "만료";

function getStatus(item: FridgeItemDTO): FreshStatus {
  if (!item.expireDate) return "신선";
  const end = new Date(item.expireDate);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "만료";
  if (diffDays <= 3) return "임박";
  return "신선";
}

const CAT_OPTIONS: Category[] = ["육류", "해산물", "채소", "과일", "유제품/계란", "가공식품", "기타"];

const STATUS_OPTIONS: ("ALL" | FreshStatus)[] = ["ALL", "신선", "임박", "만료"];

export default function Fridge() {
  const { items, loading, err, remove } = useFridge();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"ALL" | Category>("ALL");
  const [st, setSt] = useState<"ALL" | FreshStatus>("ALL");

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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 제목 영역 */}
        <section>
          <div className="flex items-center gap-5">
            <img
              src={fridgeEmoji}
              alt="냉장고 아이콘"
              className="w-12"
            />
            <div className="flex flex-col">
              <h1 className="text-[26px] md:text-[28px] font-extrabold tracking-[-0.02em]">나의 냉장고</h1>
              <p className="text-[14px] text-slate-500 mt-0.5">냉장고 속 재료를 확인하고 관리하세요.</p>
            </div>
          </div>
        </section>

        {/* 필터 카드 */}
        <section className="mt-6 border-t border-b border-slate-200 pt-3 pb-4">
          {/* 카테고리 필터 pill 버튼 */}
          <div className="mt-1">
            <div className="text-xs font-medium text-slate-500 mb-1">
              카테고리
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ALL", ...CAT_OPTIONS] as ("ALL" | Category)[]).map((c) => {
                const active = cat === c;
                const label = c === "ALL" ? "전체" : c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={[
                      "px-4 h-9 rounded-full text-sm border transition-colors",
                      active
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 신선도 필터 pill 버튼 */}
          <div className="mt-4">
            <div className="text-xs font-medium text-slate-500 mb-1">
              신선도
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((sOpt) => {
                const active = st === sOpt;
                const label = sOpt === "ALL" ? "모든 상태" : sOpt;
                return (
                  <button
                    key={sOpt}
                    type="button"
                    onClick={() => setSt(sOpt)}
                    className={[
                      "px-4 h-9 rounded-full text-sm border transition-colors",
                      active
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 재료 리스트 카드 */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm mt-6">
          {/* 검색 + 추가 버튼 */}
          <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
            <div className="flex-1 min-w-[220px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="재료명 검색…"
                className="w-full h-10 px-4 rounded-full border border-gray-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-emerald-400"
              />
            </div>

            <button
              onClick={() => nav("/fridge/edit/new")}
              className="px-4 h-10 rounded-full text-white bg-green-600 hover:bg-green-700 text-sm whitespace-nowrap"
            >
              + 재료 추가
            </button>
          </div>

          <div className="overflow-auto mt-4">
            <table className="min-w-[880px] w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-gray-100">
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
