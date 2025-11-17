import { useCallback, useEffect, useState } from "react";
import { Api } from "../lib/api";
import type { FridgeItemDTO } from "../lib/api";

export function useFridge() {
  const [items, setItems] = useState<FridgeItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      let list = await Api.listFridge();

      // ✅ 빈 경우(로컬에 아무 것도 없음) 자동 시드 후 재조회
      if (!list || list.length === 0) {
        try {
          await Api.seedFridge();
          list = await Api.listFridge();
        } catch {
          // 실서버 모드일 때 seed가 실패할 수 있음 → 그냥 빈 리스트 유지
        }
      }

      setItems(list);
    } catch (e: any) {
      setErr(e.message || "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addBulk = useCallback(async (drafts: Omit<FridgeItemDTO, "id">[]) => {
    await Api.addBulk(drafts);
    await fetch();
  }, [fetch]);

  const update = useCallback(async (item: FridgeItemDTO) => {
    await Api.update(item);
    await fetch();
  }, [fetch]);

  const remove = useCallback(async (id: string) => {
    await Api.remove(id);
    await fetch();
  }, [fetch]);

  return { items, loading, err, fetch, addBulk, update, remove };
}
