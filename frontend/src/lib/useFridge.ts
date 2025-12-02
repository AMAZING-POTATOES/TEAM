import { useCallback, useEffect, useState } from "react";
import {
  getRefrigeratorItems,
  addRefrigeratorItem,
  updateRefrigeratorItem,
  deleteRefrigeratorItem,
  type RefrigeratorItem,
} from "../api/refrigerator";
import type { FridgeItemDTO } from "../lib/api";
import { useAuth } from "../app/AuthProvider";

/**
 * 백엔드 RefrigeratorItem을 프론트엔드 FridgeItemDTO로 변환
 */
function toFridgeDTO(item: RefrigeratorItem): FridgeItemDTO {
  const storageMap: Record<string, "냉장" | "냉동" | "실온"> = {
    FRIDGE: "냉장",
    FREEZER: "냉동",
    ROOM_TEMP: "실온",
  };

  // 카테고리 매핑: 백엔드에서 다양한 형식으로 올 수 있는 카테고리를 표준화
  const categoryMap: Record<string, "육류" | "해산물" | "채소" | "과일" | "유제품/계란" | "가공식품" | "기타"> = {
    // 한글 (표준)
    "육류": "육류",
    "해산물": "해산물",
    "채소": "채소",
    "과일": "과일",
    "유제품/계란": "유제품/계란",
    "가공식품": "가공식품",
    "기타": "기타",
    // 영어 (백엔드가 영어로 보낼 경우 대비)
    "MEAT": "육류",
    "SEAFOOD": "해산물",
    "VEGETABLE": "채소",
    "FRUIT": "과일",
    "DAIRY": "유제품/계란",
    "PROCESSED": "가공식품",
    "ETC": "기타",
    "OTHER": "기타",
  };

  // 디버깅: 백엔드에서 받은 원본 데이터 로깅
  console.log("🔍 toFridgeDTO - 백엔드 원본 데이터:", {
    itemId: item.itemId,
    category: item.category,
    memo: item.memo,
    categoryType: typeof item.category,
    memoType: typeof item.memo,
    memoExists: item.memo !== undefined && item.memo !== null,
  });

  // 카테고리 변환: 매핑 테이블에서 찾거나, 그대로 사용하거나, 기타로 fallback
  let mappedCategory: any = "기타";
  if (item.category) {
    const upperCategory = item.category.toUpperCase();
    mappedCategory = categoryMap[item.category] || categoryMap[upperCategory] || item.category;

    // 매핑 후에도 유효한 카테고리가 아니면 "기타"
    const validCategories = ["육류", "해산물", "채소", "과일", "유제품/계란", "가공식품", "기타"];
    if (!validCategories.includes(mappedCategory)) {
      console.warn(`⚠️ 알 수 없는 카테고리: ${item.category} -> 기타로 변환`);
      mappedCategory = "기타";
    }
  }

  // 메모 처리: undefined, null, 빈 문자열 모두 처리
  const memoValue = item.memo?.trim() || "";

  if (memoValue) {
    console.log(`✅ 메모 데이터 있음 (ID: ${item.itemId}): "${memoValue}"`);
  } else {
    console.log(`ℹ️ 메모 데이터 없음 (ID: ${item.itemId})`);
  }

  return {
    id: item.itemId.toString(),
    name: item.ingredientName,
    amount: item.quantity,
    storage: storageMap[item.storageMethod] || "냉장",
    category: mappedCategory,
    purchaseDate: item.purchaseDate || "",
    expireDate: item.expirationDate || "",
    memo: memoValue,
  };
}

/**
 * 프론트엔드 FridgeItemDTO를 백엔드 형식으로 변환
 */
function toBackendItem(draft: Omit<FridgeItemDTO, "id">) {
  const storageMap: Record<string, "FRIDGE" | "FREEZER" | "ROOM_TEMP"> = {
    냉장: "FRIDGE",
    냉동: "FREEZER",
    실온: "ROOM_TEMP",
  };

  return {
    ingredientName: draft.name,
    quantity: draft.amount,
    storageMethod: storageMap[draft.storage] || "FRIDGE",
    category: draft.category,
    purchaseDate: draft.purchaseDate || undefined,
    expirationDate: draft.expireDate || undefined,
    memo: draft.memo || undefined,
  };
}

export function useFridge() {
  const { user } = useAuth();
  const [items, setItems] = useState<FridgeItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      console.log("🔄 useFridge: 데이터 로딩 시작...");
      console.log("👤 useFridge: 현재 사용자:", user);
      setLoading(true);
      setErr(null);
      const backendItems = await getRefrigeratorItems();
      const fridgeItems = backendItems.map(toFridgeDTO);
      setItems(fridgeItems);
      console.log("✅ useFridge: 데이터 수신 성공:", fridgeItems.length, "개");
    } catch (e: any) {
      console.error("❌ useFridge: 데이터 로딩 실패:", e);
      setErr(e.message || "불러오기 실패");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // user 상태 변경 시 데이터 재로드
  useEffect(() => {
    fetch();
  }, [fetch]);

  const addBulk = useCallback(
    async (drafts: Omit<FridgeItemDTO, "id">[]) => {
      try {
        // 각 아이템을 개별적으로 추가
        for (const draft of drafts) {
          const backendItem = toBackendItem(draft);
          await addRefrigeratorItem(backendItem);
        }
        await fetch();
      } catch (e: any) {
        throw new Error(e.message || "추가 실패");
      }
    },
    [fetch]
  );

  const update = useCallback(
    async (item: FridgeItemDTO) => {
      try {
        const backendItem = toBackendItem(item);
        const itemId = parseInt(item.id, 10);
        await updateRefrigeratorItem(itemId, backendItem);
        await fetch();
      } catch (e: any) {
        throw new Error(e.message || "수정 실패");
      }
    },
    [fetch]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        const itemId = parseInt(id, 10);
        await deleteRefrigeratorItem(itemId);
        await fetch();
      } catch (e: any) {
        throw new Error(e.message || "삭제 실패");
      }
    },
    [fetch]
  );

  return { items, loading, err, fetch, addBulk, update, remove };
}
