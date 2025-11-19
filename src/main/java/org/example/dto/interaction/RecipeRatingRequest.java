package org.example.dto.interaction;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RecipeRatingRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    public RecipeRatingRequest() {
    }

    public RecipeRatingRequest(Integer rating) {
        this.rating = rating;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}

