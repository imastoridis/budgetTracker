package com.budgetTracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for Category.
 */
@Getter
@Setter
public class CategoryDto {

    // Getters and Setters
    private Long id;
    @NotBlank(message = "Category name cannot be empty.")
    @Size(max = 50, message = "Category name cannot exceed 50 characters.")

    private String name;

    private Long userId;

    // No-args Constructor
    public CategoryDto() {
    }

    // All-args constructor
    public CategoryDto(Long id, String name, Long userId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
    }
}