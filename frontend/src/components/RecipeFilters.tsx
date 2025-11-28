type Props = {
  query: string; setQuery: (v: string) => void;
  cookableOnly: boolean; setCookableOnly: (v:boolean)=>void;
};

export default function RecipeFilters({
  query, setQuery,
  cookableOnly, setCookableOnly
}: Props){
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="flex-1 min-w-[260px] rounded-full border border-gray-200 px-3 py-2"
        placeholder="레시피를 검색해보세요 (e.g., 김치찌개)"
        value={query}
        onChange={e=>setQuery(e.target.value)}
      />
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={cookableOnly}
          onChange={e=>setCookableOnly(e.target.checked)}
        />
        만들 수 있는 것만
      </label>
    </div>
  );
}
