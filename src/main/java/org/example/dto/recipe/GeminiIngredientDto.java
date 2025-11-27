package org.example.dto.recipe;

import com.google.gson.annotations.SerializedName;

/**
 * Gemini API 요청/응답에서 사용하는 재료 정보 DTO
 */
public class GeminiIngredientDto {

    @SerializedName("name")
    private String name;           // 재료명

    @SerializedName("quantity")
    private String quantity;       // 수량

    @SerializedName("priority_score")
    private Integer priorityScore; // 우선순위 점수 (0-100)

    @SerializedName("days_until_expiry")
    private Integer daysUntilExpiry; // 만료까지 남은 일수

    @SerializedName("amount")
    private String amount;         // 사용한 양 (응답용)

    @SerializedName("preparation")
    private String preparation;    // 손질 방법 (응답용)

    @SerializedName("note")
    private String note;           // 참고사항 (응답용)

    public GeminiIngredientDto() {
    }

    public GeminiIngredientDto(String name, String quantity, Integer priorityScore, Integer daysUntilExpiry) {
        this.name = name;
        this.quantity = quantity;
        this.priorityScore = priorityScore;
        this.daysUntilExpiry = daysUntilExpiry;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public Integer getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(Integer priorityScore) {
        this.priorityScore = priorityScore;
    }

    public Integer getDaysUntilExpiry() {
        return daysUntilExpiry;
    }

    public void setDaysUntilExpiry(Integer daysUntilExpiry) {
        this.daysUntilExpiry = daysUntilExpiry;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getPreparation() {
        return preparation;
    }

    public void setPreparation(String preparation) {
        this.preparation = preparation;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
