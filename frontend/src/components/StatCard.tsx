export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-[1.25rem] shadow">
      <div className="w-12 h-12 grid place-items-center rounded-[1rem] bg-green-50 text-green-700 text-xl">
        {icon}
      </div>
      <div>
        <div className="text-slate-500 text-sm">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
