package org.example.dto.recipe;

import com.google.gson.annotations.SerializedName;

/**
 * Gemini API 응답에서 사용하는 조리 단계 DTO
 */
public class GeminiCookingStepDto {

    @SerializedName("step")
    private Integer step;         // 단계 번호

    @SerializedName("instruction")
    private String instruction;   // 조리 설명

    @SerializedName("time_minutes")
    private Integer timeMinutes;  // 소요 시간 (분)

    public GeminiCookingStepDto() {
    }

    public GeminiCookingStepDto(Integer step, String instruction, Integer timeMinutes) {
        this.step = step;
        this.instruction = instruction;
        this.timeMinutes = timeMinutes;
    }

    // Getters and Setters
    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public Integer getTimeMinutes() {
        return timeMinutes;
    }

    public void setTimeMinutes(Integer timeMinutes) {
        this.timeMinutes = timeMinutes;
    }
}
