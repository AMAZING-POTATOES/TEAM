type Props = { value: number; size?: "sm" | "md" };
export default function RecipeRating({ value, size = "md" }: Props) {
  const cls = size === "sm" ? "text-[13px]" : "text-[15px]";
  return (
    <div className={`flex items-center gap-1 ${cls}`}>
      <span className="font-semibold">{value.toFixed(1)}</span>
      <span className="text-yellow-500" aria-hidden>★★★★★</span>
    </div>
  );
}
