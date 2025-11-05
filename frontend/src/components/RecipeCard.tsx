export default function RecipeCard({
  title,
  subtitle,
  img,
}: {
  title: string;
  subtitle: string;
  img: string;
}) {
  return (
    <div className="bg-white rounded-[1.25rem] shadow overflow-hidden">
      <img src={img} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}
