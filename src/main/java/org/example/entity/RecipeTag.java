package org.example.entity;

import jakarta.persistence.*;

/**
 * 레시피 태그 Entity
 * Recipe_Tags 테이블과 매핑
 */
@Entity
@Table(name = "recipe_tags", indexes = {
    @Index(name = "idx_recipe_id", columnList = "recipe_id"),
    @Index(name = "idx_tag_name", columnList = "tag_name")
})
public class RecipeTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(name = "tag_name", nullable = false, length = 50)
    private String tagName;

    // 기본 생성자
    public RecipeTag() {
    }

    // 생성자
    public RecipeTag(Recipe recipe, String tagName) {
        this.recipe = recipe;
        this.tagName = tagName;
    }

    // Getters and Setters
    public Long getTagId() {
        return tagId;
    }

    public void setTagId(Long tagId) {
        this.tagId = tagId;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }
}

