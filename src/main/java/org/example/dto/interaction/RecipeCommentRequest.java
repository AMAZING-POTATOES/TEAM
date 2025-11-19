package org.example.dto.interaction;

import jakarta.validation.constraints.NotBlank;

public class RecipeCommentRequest {

    @NotBlank
    private String content;

    public RecipeCommentRequest() {
    }

    public RecipeCommentRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

