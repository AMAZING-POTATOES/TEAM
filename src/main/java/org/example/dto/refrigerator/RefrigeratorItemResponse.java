package org.example.dto.refrigerator;

import org.example.entity.RefrigeratorItem;
import org.example.entity.enums.ItemStatus;
import org.example.entity.enums.StorageMethod;

import java.time.LocalDate;

public class RefrigeratorItemResponse {

    private Long itemId;
    private Long userId;
    private String ingredientName;
    private String quantity;
    private LocalDate purchaseDate;
    private LocalDate expirationDate;
    private StorageMethod storageMethod;
    private ItemStatus status;
    private String category;
    private String memo;

    public static RefrigeratorItemResponse from(RefrigeratorItem item) {
        RefrigeratorItemResponse response = new RefrigeratorItemResponse();
        response.setItemId(item.getItemId());
        response.setUserId(item.getUser().getUserId());
        response.setIngredientName(item.getIngredientName());
        response.setQuantity(item.getQuantity());
        response.setPurchaseDate(item.getPurchaseDate());
        response.setExpirationDate(item.getExpirationDate());
        response.setStorageMethod(item.getStorageMethod());
        response.setStatus(item.getStatus());
        response.setCategory(item.getCategory());
        response.setMemo(item.getMemo());
        return response;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public StorageMethod getStorageMethod() {
        return storageMethod;
    }

    public void setStorageMethod(StorageMethod storageMethod) {
        this.storageMethod = storageMethod;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}

