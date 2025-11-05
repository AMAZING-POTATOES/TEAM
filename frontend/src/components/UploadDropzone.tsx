import { useRef, useState } from "react";

export default function UploadDropzone() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [name, setName] = useState<string>("");

  const simulate = (file: File) => {
    setName(file.name);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + 7;
      });
    }, 100);
  };

  return (
    <div className="bg-white rounded-[1.25rem] shadow p-6 border border-slate-100">
      <div
        className="border-2 border-dashed rounded-[1.25rem] py-16 grid place-items-center hover:bg-slate-50 cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">⤓</div>
          <div className="font-medium">여기에 영수증 파일을 드래그 앤 드롭하세요</div>
          <div className="text-slate-500 text-sm mt-1">또는</div>
          <button className="mt-3 px-4 py-2 rounded-full bg-green-600 text-white shadow">
            파일 선택
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) simulate(f);
        }}
      />

      {name && (
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-600">{name}</span>
            <span className="text-sm text-slate-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
