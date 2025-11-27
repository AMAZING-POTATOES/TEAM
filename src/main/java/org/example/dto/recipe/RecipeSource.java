package org.example.dto.recipe;

/**
 * 레시피 소스를 나타내는 Enum
 */
public enum RecipeSource {
    LOCAL_DB("로컬 데이터베이스"),
    EXTERNAL_CRAWL("만개의레시피");

    private final String description;

    RecipeSource(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
