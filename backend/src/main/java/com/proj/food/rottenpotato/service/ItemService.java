package com.proj.food.rottenpotato.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// 이 Service가 DB 연동을 담당하게 될 메인 로직 파일입니다.
@Service
public class ItemService {

    // 🚨 [임시] DB 연동 전 데이터를 저장할 가짜 리스트 (나중에 DB 코드로 대체)
    private final List<Map<String, Object>> userInventory = new ArrayList<>();
    private long nextId = 1;

    /**
     * ✅ 재고 목록에 새 품목을 추가합니다. (OCR 파이프라인의 최종 단계)
     * @param itemData 분류 및 만료일 계산이 완료된 품목 데이터
     * @return 추가된 품목 데이터
     */
    public Map<String, Object> addItem(Map<String, Object> itemData) {
        // DB 대신 임시 ID를 부여하고 리스트에 추가
        itemData.put("itemId", nextId++);
        userInventory.add(itemData);
        System.out.println("--- [DEBUG: Inventory] 품목 추가됨: " + itemData.get("name"));
        return itemData;
    }

    /**
     * ✅ 전체 재고 목록을 조회합니다.
     * @return 전체 재고 품목 리스트
     */
    public List<Map<String, Object>> getAllItems() {
        // DB 대신 임시 리스트를 반환
        return userInventory;
    }

    /**
     * ✅ 특정 품목을 ID로 삭제합니다.
     * @param itemId 삭제할 품목 ID
     * @return 삭제 성공 여부
     */
    public boolean deleteItem(Long itemId) {
        // DB 대신 임시 리스트에서 ID로 필터링하여 제거
        return userInventory.removeIf(item -> 
            Optional.ofNullable(item.get("itemId"))
                    .map(id -> id.equals(itemId))
                    .orElse(false)
        );
    }
}