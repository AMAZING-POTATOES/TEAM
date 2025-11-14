package org.example.entity;

import jakarta.persistence.*;

/**
 * 레시피 조리 순서 Entity
 * Recipe_Steps 테이블과 매핑
 */
@Entity
@Table(name = "recipe_steps", indexes = {
    @Index(name = "idx_recipe_id", columnList = "recipe_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "unique_recipe_step", columnNames = {"recipe_id", "step_number"})
})
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_id")
    private Long stepId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    // 기본 생성자
    public RecipeStep() {
    }

    // 생성자
    public RecipeStep(Recipe recipe, Integer stepNumber, String description) {
        this.recipe = recipe;
        this.stepNumber = stepNumber;
        this.description = description;
    }

    // Getters and Setters
    public Long getStepId() {
        return stepId;
    }

    public void setStepId(Long stepId) {
        this.stepId = stepId;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
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

