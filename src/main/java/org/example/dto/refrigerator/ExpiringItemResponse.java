package org.example.dto.refrigerator;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class ExpiringItemResponse {

    private Long itemId;
    private String ingredientName;
    private LocalDate expirationDate;
    private long daysUntilExpiration;

    public ExpiringItemResponse() {
    }

    public ExpiringItemResponse(Long itemId, String ingredientName, LocalDate expirationDate) {
        this.itemId = itemId;
        this.ingredientName = ingredientName;
        this.expirationDate = expirationDate;
        if (expirationDate != null) {
            this.daysUntilExpiration = ChronoUnit.DAYS.between(LocalDate.now(), expirationDate);
        }
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

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public long getDaysUntilExpiration() {
        return daysUntilExpiration;
    }

    public void setDaysUntilExpiration(long daysUntilExpiration) {
        this.daysUntilExpiration = daysUntilExpiration;
    }
}

