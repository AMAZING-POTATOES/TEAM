// src/data/recipes.ts
export type Category = "한식" | "중식" | "양식" | "일식" | "디저트" | "기타";
export type Level = "쉬움" | "보통" | "어려움";

export type Recipe = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  timeMinutes: number;
  rating?: number;
  ratingCount?: number;
  tags: string[];
  ingredients: { id?: string; name: string; amount?: string; inStock?: boolean }[];
  steps: string[];

  // 커뮤니티/외부수집용 메타 (옵션)
  authorName?: string;          // 게시자 혹은 출처
  likes?: number;
  comments?: number;
  coverUrl?: string | null;     // 대표 이미지 (없으면 null/undefined)
  source?: "community" | "external" | "system" | "ai";
};

// 🔧 실제에선 API/DB로 대체. 지금은 목업으로 통합 사용.
export const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "신선한 토마토와 바질을 곁들인 스파게티",
    category: "양식",
    level: "쉬움",
    timeMinutes: 30,
    rating: 4.8,
    ratingCount: 3518,
    tags: ["#파스타", "#토마토"],
    ingredients: [
      { name: "스파게티면", amount: "200g", inStock: true },
      { name: "방울토마토", amount: "15개", inStock: true },
      { name: "마늘", amount: "5쪽", inStock: true },
      { name: "올리브 오일", amount: "3큰술", inStock: true },
      { name: "소금", amount: "약간", inStock: true },
    ],
    steps: ["면 삶기", "마늘 향내기", "토마토 볶기", "면과 버무리기"],
    authorName: "오리올 비뇨",
    likes: 128,
    comments: 12,
    coverUrl: null,
    source: "community",
  },
  {
    id: "2",
    title: "매콤달콤 제육볶음",
    category: "한식",
    level: "쉬움",
    timeMinutes: 20,
    rating: 4.6,
    ratingCount: 2201,
    tags: ["#한식", "#돼지고기"],
    ingredients: [
      { name: "돼지고기 앞다리", amount: "300g", inStock: true },
      { name: "양파", amount: "1/2개", inStock: true },
      { name: "고추장", amount: "2큰술", inStock: true },
      { name: "고춧가루", amount: "1큰술", inStock: true },
      { name: "간장", amount: "1큰술", inStock: true },
    ],
    steps: ["양념 만들기", "고기 재우기", "센불에 볶기", "채소 넣고 마무리"],
    authorName: "집밥러 신선",
    likes: 256,
    comments: 34,
    coverUrl: null,
    source: "community",
  },
  // 재료추천 전용/시스템 레시피(커뮤니티 아님)
  {
    id: "101",
    title: "아메리카노 브라우니 디저트",
    category: "디저트",
    level: "보통",
    timeMinutes: 40,
    rating: 4.2,
    ratingCount: 120,
    tags: ["#디저트"],
    ingredients: [{ name: "초코", amount: "200g" }],
    steps: ["반죽", "굽기", "식히기"],
    source: "system",
  },
];
