import React, { useState } from "react";

type TabKey = "profile" | "saved" | "posts";

type Recipe = {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
};

const dummyRecipes: Recipe[] = [
  {
    id: 1,
    title: "토마토 스파게티",
    subtitle: "간단하고 맛있는 클래식 파스타",
    description:
      "간단하게 맛있는 파스타를 먹고 싶을 때 어울리는 요리입니다. 신선한 토마토와 바질 향을 더해 더욱 풍미를 살렸습니다.",
    imageUrl:
      "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    title: "닭가슴살 샐러드",
    subtitle: "건강한 한 끼 식사",
    description:
      "담백하고 부드러운 닭가슴살과 신선한 채소를 듬뿍 담은 샐러드입니다. 든든하면서도 부담스럽지 않은 식단용 메뉴입니다.",
    imageUrl:
      "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    title: "김치볶음밥",
    subtitle: "누구나 좋아하는 한 그릇 요리",
    description:
      "매콤한 김치와 고소한 밥이 만나 언제 먹어도 맛있는 김치볶음밥입니다. 계란 후라이를 곁들이면 더 좋아요.",
    imageUrl:
      "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    title: "스테이크",
    subtitle: "특별한 날의 저녁 메뉴",
    description:
      "풍부한 육즙을 가득 머금은 두툼한 스테이크입니다. 구운 채소와 곁들여 근사한 한 끼 식사를 완성해 보세요.",
    imageUrl:
      "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const [recipes, setRecipes] = useState<Recipe[]>(dummyRecipes);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleDeleteRecipe = (id: number) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const pushToggleClass = pushEnabled
    ? "bg-[color:var(--color-primary)] justify-end"
    : "bg-gray-200 justify-start";
  const emailToggleClass = emailEnabled
    ? "bg-[color:var(--color-primary)] justify-end"
    : "bg-gray-200 justify-start";

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[color:var(--bg-app)] text-[color:var(--text-main)]">
      {/* 사이드바 */}
      <aside className="w-56 bg-[#f9fafb] border-r border-[color:var(--border-soft)] flex flex-col justify-between px-4 py-6">
        <div>
          <div className="flex flex-col items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="text-sm font-semibold text-[color:var(--text-main)]">
              사용자 이름
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              className={`w-full text-left text-sm rounded-md px-3 py-2 transition-colors ${
                activeTab === "profile"
                  ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary)] font-semibold"
                  : "text-[color:var(--text-secondary)] hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              프로필 정보
            </button>
            <button
              className={`w-full text-left text-sm rounded-md px-3 py-2 transition-colors ${
                activeTab === "saved"
                  ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary)] font-semibold"
                  : "text-[color:var(--text-secondary)] hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              저장한 레시피
            </button>
            <button
              className={`w-full text-left text-sm rounded-md px-3 py-2 transition-colors ${
                activeTab === "posts"
                  ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary)] font-semibold"
                  : "text-[color:var(--text-secondary)] hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              작성한 게시물
            </button>
          </nav>
        </div>

        <button className="text-sm text-[color:var(--warn)]">로그아웃</button>
      </aside>

      {/* 메인 */}
      <main className="flex-1 px-10 py-8">
        <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

        {/* 탭: 프로필 정보 */}
        {activeTab === "profile" && (
          <>
            {/* 프로필 카드 */}
            <section className="bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border-soft)] shadow-sm p-6 mb-5 flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="text-lg font-semibold">사용자 이름</div>
                <div className="text-sm text-[color:var(--text-secondary)] mt-1">
                  email@example.com
                </div>
              </div>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[color:var(--color-primary)] text-white">
                프로필 편집
              </button>
            </section>

            {/* 저장한 레시피 요약 */}
            <section className="bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border-soft)] shadow-sm p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">저장한 레시피</h2>
                <button className="text-sm text-[color:var(--color-primary)]"
                onClick={() => setActiveTab("saved")}>
                  더보기
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-1">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="min-w-[160px] max-w-[180px] bg-[#f9fafb] rounded-2xl shadow-sm p-2"
                  >
                    <div
                      className="w-full rounded-xl pt-[70%] bg-center bg-cover mb-2"
                      style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                    />
                    <div>
                      <div className="text-sm font-semibold line-clamp-1">
                        {recipe.title}
                      </div>
                      <div className="text-xs text-[color:var(--text-secondary)] line-clamp-2 mt-0.5">
                        {recipe.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 앱 설정 */}
            <section className="bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border-soft)] shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">앱 설정</h2>

              <div className="border-t border-[color:var(--border-soft)] pt-3 mt-2">
                <div className="text-sm font-semibold mb-2">알림 설정</div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium">푸시 알림</div>
                    <div className="text-xs text-[color:var(--text-secondary)] mt-0.5">
                      새로운 요리 레시피 및 맞춤 알림
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushEnabled((v) => !v)}
                    className={`w-11 h-6 rounded-full px-[3px] flex items-center transition-colors ${pushToggleClass}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium">이메일 알림</div>
                    <div className="text-xs text-[color:var(--text-secondary)] mt-0.5">
                      주간 소식 및 이벤트 정보 수신
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailEnabled((v) => !v)}
                    className={`w-11 h-6 rounded-full px-[3px] flex items-center transition-colors ${emailToggleClass}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </button>
                </div>
              </div>

              {/* 계정 관리 */}
              <div className="border-t border-[color:var(--border-soft)] pt-3 mt-4">
                <div className="text-sm font-semibold mb-2">계정 관리</div>
                <div className="flex gap-3">
                  <button className="text-sm text-[color:var(--color-primary)]">
                    로그아웃
                  </button>
                  <button className="text-sm text-[color:var(--warn)]">
                    회원 탈퇴
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 탭: 저장한 레시피 */}
        {activeTab === "saved" && (
          <section className="bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border-soft)] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">저장한 레시피</h2>

              <div className="flex gap-2">
                <button
                  className={`w-8 h-8 text-xs rounded-md border border-[color:var(--border-soft)] ${
                    viewMode === "grid"
                      ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary)]"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="그리드 보기"
                >
                  ▦
                </button>
                <button
                  className={`w-8 h-8 text-xs rounded-md border border-[color:var(--border-soft)] ${
                    viewMode === "list"
                      ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary)]"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setViewMode("list")}
                  title="리스트 보기"
                >
                  ☰
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="relative bg-[#f9fafb] rounded-2xl p-3 shadow-sm"
                  >
                    <button
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      ✕
                    </button>
                    <div
                      className="w-full rounded-xl pt-[65%] bg-center bg-cover mb-3"
                      style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                    />
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        {recipe.title}
                      </div>
                      <div className="text-xs text-[color:var(--text-secondary)] mb-1">
                        {recipe.subtitle}
                      </div>
                      <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed line-clamp-3">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-4 bg-[#f9fafb] rounded-2xl p-3 shadow-sm"
                  >
                    <div
                      className="w-32 h-24 rounded-xl bg-center bg-cover flex-shrink-0"
                      style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">
                        {recipe.title}
                      </div>
                      <div className="text-xs text-[color:var(--text-secondary)] mb-1">
                        {recipe.subtitle}
                      </div>
                      <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed line-clamp-3">
                        {recipe.description}
                      </p>
                    </div>
                    <button
                      className="w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 탭: 작성한 게시물 */}
        {activeTab === "posts" && (
          <section className="bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border-soft)] shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-3">작성한 게시물</h2>
            <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
              아직 작성한 게시물이 없습니다.
              <br />
              오늘 만든 요리를 기록해 보세요!
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default MyPage;
