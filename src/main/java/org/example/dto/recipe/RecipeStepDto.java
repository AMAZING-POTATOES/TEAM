package org.example.dto.recipe;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class RecipeStepDto {

    @Min(1)
    private Integer stepNumber;

    @NotBlank
    private String description;

    public RecipeStepDto() {
    }

    public RecipeStepDto(Integer stepNumber, String description) {
        this.stepNumber = stepNumber;
        this.description = description;
    }

    public Integer getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

