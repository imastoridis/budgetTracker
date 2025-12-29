package com.budgetTracker.dto;

import com.budgetTracker.model.enums.CategoryType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

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

    @NotNull(message = "Transaction type is required.")
    private CategoryType type;

    private BigDecimal totalAmount;

    // No-args Constructor
    public CategoryDto() {
    }

    // All-args constructor
    public CategoryDto(Long id, String name, Long userId, CategoryType type, BigDecimal totalAmount) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.type = type;
        this.totalAmount = totalAmount;
    }
}