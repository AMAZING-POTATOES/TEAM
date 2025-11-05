// src/lib/api.ts
// 프론트 Mock API + 타입 정의

export type Category =
  | "육류"
  | "해산물"
  | "채소"
  | "과일"
  | "유제품/계란"
  | "가공식품"
  | "기타";

export type FridgeItemDTO = {
  id: string;
  name: string;
  amount: string;
  storage: "냉장" | "냉동" | "실온";
  category: Category;
  purchaseDate?: string;
  expireDate?: string;
  memo?: string;
};

export type ClassifiedMap = Record<Category, string[]>;

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const KEY = "ssak:fridge";

function read(): FridgeItemDTO[] {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as FridgeItemDTO[]) : [];
}
function write(list: FridgeItemDTO[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const Api = {
  /** OCR 결과 (모의) 또는 실제 서버 파싱 */
  async parseReceipt(
    file: File,
    onProgress?: (p: number) => void
  ): Promise<ClassifiedMap> {
    if (USE_MOCK) {
      // --- MOCK: 파일명 키워드로 간단 분류 ---
      const lower = file.name.toLowerCase();
      const r: ClassifiedMap = {
        육류: [],
        해산물: [],
        채소: [],
        과일: [],
        "유제품/계란": [],
        가공식품: [],
        기타: [],
      };
      const push = (c: Category, n: string) => r[c].push(n);

      if (/(beef|소고기|pork|chicken)/.test(lower)) push("육류", "소고기");
      if (/(fish|연어|shrimp|오징어)/.test(lower)) push("해산물", "연어");
      if (/(onion|양파|파)/.test(lower)) push("채소", "양파");
      if (/(apple|사과|banana|바나나)/.test(lower)) push("과일", "사과");
      if (/(milk|우유|yogurt|egg|계란)/.test(lower))
        push("유제품/계란", "우유와 계란");
      if (/(tofu|두부|ham|햄|spam)/.test(lower)) push("가공식품", "두부");

      if (Object.values(r).every((arr) => arr.length === 0)) {
        push("채소", "대파");
        push("유제품/계란", "요거트");
      }

      if (onProgress) {
        let p = 0;
        await new Promise<void>((res) => {
          const id = setInterval(() => {
            p = Math.min(100, p + 12);
            onProgress(p);
            if (p >= 100) {
              clearInterval(id);
              res();
            }
          }, 100);
        });
      }
      return r;
    }

    throw new Error("parseReceipt real API not implemented");
  },

  /** 냉장고 목록 */
  async listFridge(): Promise<FridgeItemDTO[]> {
    if (USE_MOCK) {
      let list = read();
      if (list.length === 0) {
        // 비어있으면 자동 시드
        const seed: FridgeItemDTO[] = [
          {
            id: "1",
            name: "우유",
            amount: "900ml",
            category: "유제품/계란",
            storage: "냉장",
            purchaseDate: "2025-11-01",
            expireDate: "2025-11-08",
          },
          {
            id: "2",
            name: "계란",
            amount: "15구",
            category: "유제품/계란",
            storage: "냉장",
            purchaseDate: "2025-11-02",
            expireDate: "2025-11-16",
          },
          {
            id: "3",
            name: "두부",
            amount: "1모",
            category: "가공식품",
            storage: "냉장",
            purchaseDate: "2025-11-03",
            expireDate: "2025-11-10",
          },
          {
            id: "4",
            name: "양파",
            amount: "3개",
            category: "채소",
            storage: "실온",
            purchaseDate: "2025-10-28",
            expireDate: "2025-11-20",
          },
        ];
        write(seed);
        list = seed;
      }
      return list;
    }

    return [];
  },

  async addBulk(items: Omit<FridgeItemDTO, "id">[]): Promise<void> {
    if (USE_MOCK) {
      const cur = read();
      const next = cur.concat(items.map((it) => ({ ...it, id: uid() })));
      write(next);
      return;
    }
  },

  async update(item: FridgeItemDTO): Promise<void> {
    if (USE_MOCK) {
      const cur = read();
      const idx = cur.findIndex((x) => x.id === item.id);
      if (idx >= 0) cur[idx] = item;
      write(cur);
      return;
    }
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      const cur = read().filter((x) => x.id !== id);
      write(cur);
      return;
    }
  },

  async seedFridge(): Promise<void> {
    if (!USE_MOCK) throw new Error("Mock 모드에서만 사용");
    const seed: FridgeItemDTO[] = [
      {
        id: "1",
        name: "우유",
        amount: "900ml",
        category: "유제품/계란",
        storage: "냉장",
        purchaseDate: "2025-11-01",
        expireDate: "2025-11-08",
      },
      {
        id: "2",
        name: "계란",
        amount: "15구",
        category: "유제품/계란",
        storage: "냉장",
        purchaseDate: "2025-11-02",
        expireDate: "2025-11-16",
      },
      {
        id: "3",
        name: "두부",
        amount: "1모",
        category: "가공식품",
        storage: "냉장",
        purchaseDate: "2025-11-03",
        expireDate: "2025-11-10",
      },
      {
        id: "4",
        name: "양파",
        amount: "3개",
        category: "채소",
        storage: "실온",
        purchaseDate: "2025-10-28",
        expireDate: "2025-11-20",
      },
    ];
    write(seed);
  },

  async resetFridge(): Promise<void> {
    if (!USE_MOCK) throw new Error("Mock 모드에서만 사용");
    localStorage.removeItem(KEY);
  },
};
