import { useRef, useState } from "react";
import { Api } from "../lib/api";

type OcrStage = 'upload' | 'recognize' | 'extract' | 'complete';

const STAGE_INFO: Record<OcrStage, { label: string; emoji: string }> = {
  upload: { label: '영수증 업로드 중', emoji: '📤' },
  recognize: { label: 'OCR 텍스트 인식 중', emoji: '🔍' },
  extract: { label: '재료 데이터 추출 중', emoji: '📊' },
  complete: { label: '처리 완료', emoji: '✅' },
};

export default function UploadDropzone() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<OcrStage>('upload');
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleUpload = async (file: File) => {
    setName(file.name);
    setProgress(0);
    setStage('upload');
    setError(null);
    setIsProcessing(true);

    try {
      await Api.parseReceipt(file, (p) => {
        setProgress(p);
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
      setStage('complete');
      setProgress(100);
    } catch (e: any) {
      setError(e.message || "업로드 실패");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-[1.25rem] shadow p-6 border border-slate-100">
      <div
        className="border-2 border-dashed rounded-[1.25rem] py-16 grid place-items-center hover:bg-slate-50 cursor-pointer"
        onClick={() => !isProcessing && fileRef.current?.click()}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">⤓</div>
          <div className="font-medium">여기에 영수증 파일을 드래그 앤 드롭하세요</div>
          <div className="text-slate-500 text-sm mt-1">또는</div>
          <button
            className="mt-3 px-4 py-2 rounded-full bg-green-600 text-white shadow disabled:opacity-50"
            disabled={isProcessing}
          >
            파일 선택
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        }}
      />

      {name && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-600">{name}</span>
            <span className="text-sm text-slate-600 font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
          </div>

          {/* 처리 단계 표시 */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <div className="text-2xl">{STAGE_INFO[stage].emoji}</div>
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  {STAGE_INFO[stage].label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {stage === 'upload' && '파일을 서버에 전송하는 중...'}
                  {stage === 'recognize' && 'AI가 영수증 텍스트를 읽고 있습니다...'}
                  {stage === 'extract' && '재료 정보를 분류하고 정리하는 중...'}
                  {stage === 'complete' && '모든 처리가 완료되었습니다!'}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-sm font-semibold">오류 발생</div>
                  <div className="text-xs mt-0.5">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
