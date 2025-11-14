package org.example.entity;

import jakarta.persistence.*;
import org.example.entity.enums.ItemStatus;
import org.example.entity.enums.StorageMethod;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 냉장고 재료 Entity
 * Refrigerator_Items 테이블과 매핑
 */
@Entity
@Table(name = "refrigerator_items", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_expiration_date", columnList = "expiration_date")
})
public class RefrigeratorItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ingredient_name", nullable = false, length = 100)
    private String ingredientName;

    @Column(name = "quantity", nullable = false, length = 50)
    private String quantity;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_method", nullable = false, length = 20)
    private StorageMethod storageMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ItemStatus status = ItemStatus.FRESH;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 기본 생성자
    public RefrigeratorItem() {
    }

    // 생성자
    public RefrigeratorItem(User user, String ingredientName, String quantity, 
                           LocalDate purchaseDate, LocalDate expirationDate, 
                           StorageMethod storageMethod, String category) {
        this.user = user;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
        this.storageMethod = storageMethod;
        this.category = category;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

