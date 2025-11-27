package org.example.dto.refrigerator;

import org.example.entity.enums.ItemStatus;
import org.example.entity.enums.StorageMethod;

import java.time.LocalDate;

public class RefrigeratorItemSummary {

    private Long itemId;
    private String ingredientName;
    private String quantity;
    private LocalDate purchaseDate;
    private LocalDate expirationDate;
    private StorageMethod storageMethod;
    private ItemStatus status;
    private String category;
    private String memo;

    public RefrigeratorItemSummary() {
    }

    public RefrigeratorItemSummary(Long itemId, String ingredientName, String quantity, LocalDate purchaseDate,
                                   LocalDate expirationDate, StorageMethod storageMethod,
                                   ItemStatus status, String category, String memo) {
        this.itemId = itemId;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
        this.storageMethod = storageMethod;
        this.status = status;
        this.category = category;
        this.memo = memo;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
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

    public LocalDate getPurchaseDate() {return purchaseDate; }

    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

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

