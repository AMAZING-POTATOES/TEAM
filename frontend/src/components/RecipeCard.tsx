import { Link } from "react-router-dom";
import Tag from "./Tag";
import RecipeRating from "./RecipeRating";
import type { Recipe } from "../lib/recipes";

export default function RecipeCard({ r }: { r: Recipe }) {
  return (
    <Link to={`/recipes/${r.id}`} className="block group">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all group-hover:shadow-md">
        {/* 이미지 없이 텍스트 카드 */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            {r.tags.slice(0, 2).map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>

          <h3 className="text-[17px] font-semibold leading-snug line-clamp-2">
            {r.title}
          </h3>

          <div className="mt-3 grid grid-cols-3 text-sm text-gray-500">
            <span className="col-span-1">⏱ {r.timeMinutes}분</span>
            <span className="col-span-1">{r.level}</span>
            <span className="col-span-1 text-right">{r.category ?? ""}</span>
          </div>

          <div className="mt-2">
            <RecipeRating value={r.rating ?? 0} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
