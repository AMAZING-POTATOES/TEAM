package org.example.dto.refrigerator;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.entity.enums.StorageMethod;

import java.time.LocalDate;

public class RefrigeratorItemRequest {

    @NotBlank
    private String ingredientName;

    @NotBlank
    private String quantity;

    private LocalDate purchaseDate;

    @NotNull
    private LocalDate expirationDate;

    @NotNull
    private StorageMethod storageMethod;

    @NotBlank
    private String category;

    private String memo;

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

