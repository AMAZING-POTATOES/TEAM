import RecipeCard from "../components/RecipeCard";

export default function Recipes() {
  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">추천 레시피</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <RecipeCard
            title="리코타 치즈 샐러드"
            subtitle="남은 우유로 직접 만든 상큼한 샐러드"
            img="https://images.unsplash.com/photo-1551892374-ecf8754cf8dc?q=80&w=1200&auto=format&fit=crop"
          />
          <RecipeCard
            title="버섯 리조또"
            subtitle="부드러운 식감과 고소함"
            img="https://images.unsplash.com/photo-1516100882582-96c3a05fe590?q=80&w=1200&auto=format&fit=crop"
          />
          <RecipeCard
            title="토마토 수프"
            subtitle="상큼하고 따뜻하게"
            img="https://images.unsplash.com/photo-1505575972945-28031a87eac3?q=80&w=1200&auto=format&fit=crop"
          />
        </div>
      </main>
    </div>
  );
}
