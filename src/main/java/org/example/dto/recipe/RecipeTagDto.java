package org.example.dto.recipe;

import jakarta.validation.constraints.NotBlank;

public class RecipeTagDto {

    @NotBlank
    private String tagName;

    public RecipeTagDto() {
    }

    public RecipeTagDto(String tagName) {
        this.tagName = tagName;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }
}

