import { Link } from "react-router-dom";
import RecipeRating from "./RecipeRating";
import type { RecipeSummary } from "../api/recipe";
import { mapDifficultyToKorean } from "../lib/recipeAdapter";

export default function RecipeCard({ r }: { r: RecipeSummary }) {
  // 크롤링된 외부 레시피인 경우 외부 링크로 처리
  const isExternalCrawl = r.source === 'EXTERNAL_CRAWL';

  console.log('RecipeCard:', r.title, 'Image URL:', r.mainImageUrl);

  const cardContent = (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all group-hover:shadow-md">
      {/* 레시피 이미지 */}
      {r.mainImageUrl ? (
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-2xl">
          <img
            src={r.mainImageUrl}
            alt={r.title}
            onError={(e) => {
              console.error('Image load failed:', r.mainImageUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Image loaded successfully:', r.mainImageUrl)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-5xl rounded-t-2xl">
          🍳
        </div>
      )}

      {/* 레시피 정보 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 flex-1">
            {r.title}
          </h3>
          {isExternalCrawl && (
            <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              외부
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 text-sm text-gray-500">
          <span className="col-span-1">⏱ {r.cookingTime ?? '-'}분</span>
          <span className="col-span-1">{r.difficulty ? mapDifficultyToKorean(r.difficulty) : '-'}</span>
          <span className="col-span-1 text-right">{r.category ?? ""}</span>
        </div>

        <div className="mt-2">
          <RecipeRating value={r.averageRating ?? 0} size="sm" />
        </div>
      </div>
    </div>
  );

  // 외부 크롤링 레시피인 경우 새 탭에서 외부 URL 열기
  if (isExternalCrawl && r.url) {
    return (
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {cardContent}
      </a>
    );
  }

  // 로컬 레시피인 경우 기존 방식대로 내부 라우팅
  return (
    <Link to={`/recipes/${r.recipeId}`} className="block group">
      {cardContent}
    </Link>
  );
}
