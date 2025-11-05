import { useNavigate } from "react-router-dom";
import { useFridge } from "../lib/useFridge";
import type { FridgeItemDTO } from "../lib/api";

// 상태 계산(Fridge 페이지와 동일 로직)
function daysToExpire(it: FridgeItemDTO): number | null {
  if (!it.expireDate) return null;
  const end = new Date(it.expireDate);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const nav = useNavigate();
  const { items } = useFridge();

  const total = items.length;
  const expiringSoon = items.filter((it) => {
    const d = daysToExpire(it);
    return d !== null && d >= 0 && d <= 3;
  }).length;

  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 업로드 배너 */}
        <section
          className="rounded-[20px] p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-primary-50) 40%, transparent)",
          }}
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-[-0.02em]">
              영수증으로 간편하게 재고 추가하기
            </h1>
            <p className="text-[color:var(--text-secondary)] mt-1">
              영수증을 업로드하여 냉장고 속 재료를 한번에 등록하세요.
            </p>
          </div>
          <button
            onClick={() => nav("/upload")}
            className="h-12 px-5 rounded-[12px] text-white font-semibold shadow hover:opacity-95 transition"
            style={{ backgroundColor: "var(--color-primary)" }}
            type="button"
          >
            영수증 업로드
          </button>
        </section>

        {/* 요약 카드(재고 연동) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-[20px] p-6 bg-[var(--bg-card)] border border-[color:var(--border-soft)] flex items-center gap-4 shadow-sm">
            <div
              className="w-12 h-12 grid place-items-center rounded-full"
              style={{
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary)",
              }}
            >
              📦
            </div>
            <div>
              <div className="text-[color:var(--text-secondary)] text-[15px] font-medium">
                총 품목 수
              </div>
              <div className="text-[28px] font-bold leading-tight">
                {total}개
              </div>
            </div>
          </div>

          <div className="rounded-[20px] p-6 bg-[var(--bg-card)] border border-[color:var(--border-soft)] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 grid place-items-center rounded-full bg-red-50 text-[color:var(--warn)]">
              ⏱️
            </div>
            <div>
              <div className="text-[color:var(--text-secondary)] text-[15px] font-medium">
                3일 내 만료
              </div>
              <div className="text-[28px] font-bold leading-tight">
                {expiringSoon}개
              </div>
            </div>
          </div>
        </section>

        {/* 인기 레시피(이미지 자리만 비워둠) */}
        <section className="mt-10">
          <h2 className="text-[22px] md:text-[24px] font-bold tracking-[-0.01em] mb-3">
            이 재료로 만들 수 있어요! 인기 레시피
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[20px] overflow-hidden bg-[var(--bg-card)] border border-[color:var(--border-soft)] hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-100 grid place-items-center text-slate-400">
                  이미지 영역
                </div>
                <div className="p-4">
                  <div className="text-[16px] font-bold truncate">레시피 제목</div>
                  <div className="text-[13px] text-[color:var(--text-secondary)]">
                    간단한 설명
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
