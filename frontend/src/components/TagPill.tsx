export default function TagPill({
  name,
  dday,
}: {
  name: string;
  dday: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-[1rem] p-4 shadow">
      <div className="font-medium">{name}</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500">냉장 보관</span>
        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">{dday}</span>
      </div>
    </div>
  );
}
