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

  return {
    id: item.itemId.toString(),
    name: item.ingredientName,
    amount: item.quantity,
    storage: storageMap[item.storageMethod] || "냉장",
    category: (item.category || "기타") as any,
    purchaseDate: item.purchaseDate || "",
    expireDate: item.expirationDate || "",
    memo: item.memo || "",
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
