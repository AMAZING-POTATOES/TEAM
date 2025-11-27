import { useEffect, useMemo, useState } from "react";
import { Api } from "../lib/api";
import type { Category, FridgeItemDTO, ClassifiedMap, ClassifiedItem } from "../lib/api";
import { useFridge } from "../lib/useFridge";

type Draft = Omit<FridgeItemDTO, "id">;
type OcrStage = 'upload' | 'recognize' | 'extract' | 'complete';

const STAGE_INFO: Record<OcrStage, { label: string; emoji: string }> = {
  upload: { label: '영수증 업로드 중', emoji: '📤' },
  recognize: { label: 'OCR 텍스트 인식 중', emoji: '🔍' },
  extract: { label: '재료 데이터 추출 중', emoji: '📊' },
  complete: { label: '처리 완료', emoji: '✅' },
};

export default function UploadReceipt() {
  const { addBulk } = useFridge();

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<OcrStage>('upload');
  const [error, setError] = useState<string | null>(null);

  // OCR 결과 (카테고리→아이템 목록)
  const [classified, setClassified] = useState<ClassifiedMap | null>(null);
  // 냉장고에 넣을 드래프트(수량/날짜 기본치 포함)
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const presentCats = useMemo(() => {
    if (!classified) return [] as Category[];
    return (Object.keys(classified) as Category[]).filter((c) => classified[c].length > 0);
  }, [classified]);

  // OCR 결과를 드래프트로 변환
  const setFromClassified = (map: ClassifiedMap) => {
    setClassified(map);

    const ds: Draft[] = [];
    (Object.keys(map) as Category[]).forEach((cat) => {
      map[cat].forEach((item: ClassifiedItem) => {
        ds.push({
          name: item.name,
          category: cat,
          amount: `${item.quantity}개`,
          storage: "냉장",
          purchaseDate: item.purchaseDate,
          expireDate: item.expireDate,
        });
      });
    });
    setDrafts(ds);
  };

  // 파일 선택/드롭 처리
  const onPick = async (f: File) => {
    setFile(f);
    setProgress(0);
    setStage('upload');
    setError(null);
    setClassified(null);
    setDrafts([]);

    try {
      const result = await Api.parseReceipt(f, (p) => {
        setProgress(p);
        // 진행률에 따라 단계 업데이트
        if (p < 33) {
          setStage('upload');
        } else if (p < 66) {
          setStage('recognize');
        } else if (p < 100) {
          setStage('extract');
        } else {
          setStage('complete');
        }
      });
      setFromClassified(result);
      setStage('complete');
    } catch (e: any) {
      setError(e.message || "업로드 실패");
    }
  };

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  const handleAdd = async () => {
    if (drafts.length === 0) return;
    await addBulk(drafts);
    alert("냉장고에 추가되었습니다.");
    setFile(null);
    setProgress(0);
    setStage('upload');
    setClassified(null);
    setDrafts([]);
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setStage('upload');
    setClassified(null);
    setDrafts([]);
    setError(null);
  };

  const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 px-3 h-9 rounded-lg border border-gray-200 bg-white shadow-sm">
      {children}
    </span>
  );

  return (
    <div>
      <main className="max-w-[1080px] mx-auto px-4 py-8">

        <section className="mb-6">
          <h1 className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.02em]">
            영수증 업로드
          </h1>

          <div className="mt-3 rounded-[18px] border border-[color:var(--border-soft)] bg-white shadow-sm p-6">
            <p className="text-[15px] text-[color:var(--text-secondary)]">
              영수증 파일을 업로드하여 재료를 자동 분류합니다.
            </p>

            <label className="mt-4 block rounded-[16px] border-2 border-dashed border-gray-300 bg-[var(--bg-card)]">
              <div className="h-40 grid place-items-center text-slate-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">⬇︎</div>
                  <div className="text-[15px] font-semibold">여기에 드래그 앤 드롭</div>
                  <div className="text-[13px] mt-1">또는 클릭하여 파일 선택</div>
                </div>
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
              <div className="mt-4 space-y-3">
                {/* 진행률 바 */}
                <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between text-[13px] text-slate-600 mb-2">
                    <div className="truncate max-w-[70%]">{file.name}</div>
                    <div className="font-semibold">{progress}%</div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "var(--color-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* 처리 단계 표시 */}
                <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-slate-100 grid place-items-center text-xl">
                        {STAGE_INFO[stage].emoji}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-slate-700">
                          {STAGE_INFO[stage].label}
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5">
                          {stage === 'upload' && '파일을 서버에 전송하는 중...'}
                          {stage === 'recognize' && 'AI가 영수증 텍스트를 읽고 있습니다...'}
                          {stage === 'extract' && '재료 정보를 분류하고 정리하는 중...'}
                          {stage === 'complete' && '모든 처리가 완료되었습니다!'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-[13px] text-slate-500 hover:text-slate-700"
                      onClick={handleReset}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {/* 단계별 진행 인디케이터 */}
                {progress > 0 && progress < 100 && (
                  <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between text-[12px]">
                      <div className={`flex items-center gap-2 ${progress >= 0 ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                        <div className={`size-6 rounded-full grid place-items-center ${progress >= 0 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          {progress > 33 ? '✓' : '1'}
                        </div>
                        <span>업로드</span>
                      </div>
                      <div className="flex-1 h-px bg-slate-200 mx-2"></div>
                      <div className={`flex items-center gap-2 ${progress >= 33 ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                        <div className={`size-6 rounded-full grid place-items-center ${progress >= 33 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          {progress > 66 ? '✓' : '2'}
                        </div>
                        <span>인식</span>
                      </div>
                      <div className="flex-1 h-px bg-slate-200 mx-2"></div>
                      <div className={`flex items-center gap-2 ${progress >= 66 ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                        <div className={`size-6 rounded-full grid place-items-center ${progress >= 66 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          {progress >= 100 ? '✓' : '3'}
                        </div>
                        <span>추출</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-red-700">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <div className="text-[13px] font-semibold">오류 발생</div>
                        <div className="text-[12px] mt-0.5">{error}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {presentCats.length > 0 && (
          <section className="rounded-[18px] border border-[color:var(--border-soft)] bg-white shadow-sm p-6">
            {/* 타이틀 라인 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold">영수증 재료 자동 분류</h2>
                <span className="text-[13px] text-[color:var(--text-secondary)]">
                  인식된 재료를 확인하고, 카테고리를 수정하세요.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 h-10 rounded-full border border-gray-300 text-[14px] hover:bg-gray-50"
                  onClick={handleReset}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-5 h-10 rounded-full text-white text-[14px] shadow hover:opacity-90"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  냉장고에 추가
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {presentCats.map((cat) => (
                <div
                  key={cat}
                  className="rounded-[14px] border border-gray-200 bg-[var(--bg-card)] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">{cat}</div>
                  </div>

                  <div className="space-y-2">
                    {classified![cat].map((item, idx) => {
                      const draftIdx = drafts.findIndex(
                        (d) => d.name === item.name && d.category === cat
                      );
                      if (draftIdx < 0) return null;
                      const d = drafts[draftIdx];
                      return (
                        <div
                          key={`${cat}-${item.name}-${idx}`}
                          className="flex items-center justify-between"
                        >
                          <Tag>
                            <span className="truncate max-w-[220px]">
                              {item.name}
                              {item.quantity > 1 && <span className="ml-1 text-xs text-gray-500">x{item.quantity}</span>}
                            </span>
                          </Tag>
                          <div className="flex items-center gap-2 text-[13px]">
                            <button
                              className="px-3 h-8 rounded-full border border-gray-300"
                              onClick={() => {
                                const next = prompt(
                                  `${item.name} 수량을 입력하세요`,
                                  d.amount
                                );
                                if (!next) return;
                                setDrafts((arr) =>
                                  arr.map((x, i) =>
                                    i === draftIdx ? { ...x, amount: next } : x
                                  )
                                );
                              }}
                            >
                              수량 {d.amount}
                            </button>
                            <button
                              className="px-3 h-8 rounded-full border border-gray-300"
                              onClick={() => {
                                const next = prompt(
                                  `${item.name} 카테고리를 입력하세요 (예: 채소/가공식품/유제품/계란 등)`,
                                  d.category
                                ) as Category | null;
                                if (!next) return;
                                setDrafts((arr) =>
                                  arr.map((x, i) =>
                                    i === draftIdx ? { ...x, category: next } : x
                                  )
                                );
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="px-3 h-8 rounded-full bg-red-500 text-white"
                              onClick={() => {
                                setDrafts((arr) => arr.filter((_, i) => i !== draftIdx));
                                setClassified((m) => {
                                  if (!m) return m;
                                  const next = { ...m };
                                  next[cat] = next[cat].filter((_, i) => i !== idx);
                                  return next;
                                });
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
