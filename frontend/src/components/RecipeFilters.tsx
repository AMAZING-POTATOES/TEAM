type Props = {
  query: string;
  setQuery: (v: string) => void;
};

export default function RecipeFilters({
  query,
  setQuery
}: Props){
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="flex-1 min-w-[260px] rounded-xl border border-gray-200 px-3 py-2"
        placeholder="레시피를 검색해보세요 (e.g., 김치찌개)"
        value={query}
        onChange={e=>setQuery(e.target.value)}
      />
    </div>
  );
}
