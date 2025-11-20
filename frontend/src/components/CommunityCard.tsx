import { Link } from "react-router-dom";
import type { Recipe } from "../lib/recipes";

export default function CommunityCard({ r }: { r: Recipe }) {
  return (
    <Link
      to={`/recipes/${r.id}`}
      className="block rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-md transition"
    >
      {r.coverUrl ? (
        <div className="h-40 w-full rounded-t-2xl overflow-hidden bg-gray-100">
          <img
            src={r.coverUrl}
            alt={r.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 w-full rounded-t-2xl bg-gray-100" />
      )}

      <div className="p-4">
        {!!r.tags?.length && (
          <div className="mb-2 flex flex-wrap gap-2">
            {r.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] bg-[#4CAF50]/10 text-[#4CAF50] ring-1 ring-[#4CAF50]/15"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug">
          {r.title}
        </h3>

        <div className="mt-2 text-xs text-gray-500">{r.authorName ?? "익명"}</div>

        <div className="mt-3 grid grid-cols-3 text-sm text-gray-500">
          <span>⏱ {r.timeMinutes}분</span>
          <span>{r.level}</span>
          <span className="text-right">{r.category}</span>
        </div>

        {typeof r.rating === "number" && (
          <div className="mt-2 text-sm">
            <span className="font-semibold">{r.rating.toFixed(1)}</span>{" "}
            <span className="text-yellow-500" aria-hidden>
              ★★★★★
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          {typeof r.likes === "number" && <span>♡ {r.likes}</span>}
          {typeof r.comments === "number" && <span>💬 {r.comments}</span>}
        </div>
      </div>
    </Link>
  );
}
