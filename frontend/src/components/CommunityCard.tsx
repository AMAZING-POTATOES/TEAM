import { Link } from "react-router-dom";
import type { RecipeSummary } from "../api/recipe";

// 난이도 매핑
const difficultyMap: Record<string, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

export default function CommunityCard({ r }: { r: RecipeSummary }) {
  return (
    <Link
      to={`/recipes/${r.recipeId}`}
      className="block rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-md transition"
    >
      {r.mainImageUrl ? (
        <div className="h-40 w-full rounded-t-2xl overflow-hidden bg-gray-100">
          <img
            src={r.mainImageUrl}
            alt={r.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 w-full rounded-t-2xl bg-gray-100 flex items-center justify-center text-4xl">
          🍳
        </div>
      )}

      <div className="p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug">
          {r.title}
        </h3>

        {r.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{r.description}</p>
        )}

        <div className="mt-2 text-xs text-gray-500">{r.authorName ?? "익명"}</div>

        <div className="mt-3 grid grid-cols-3 text-sm text-gray-500">
          <span>⏱ {r.cookingTime}분</span>
          <span>{difficultyMap[r.difficulty] || r.difficulty}</span>
          <span className="text-right">{r.category || "-"}</span>
        </div>

        {r.averageRating > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-semibold">{r.averageRating.toFixed(1)}</span>{" "}
            <span className="text-yellow-500" aria-hidden>
              ★★★★★
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>♡ {r.likeCount}</span>
          <span>💬 {r.commentCount}</span>
          <span>👁 {r.viewCount}</span>
        </div>
      </div>
    </Link>
  );
}
