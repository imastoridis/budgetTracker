package com.budgetTracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) used for creating a new Transaction.
 */
@Setter
@Getter
public class TransactionDto {

    private Long id;

    @NotNull(message = "Amount is required.")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero.")
    private BigDecimal amount;

    @NotNull(message = "Date is required.")
    private LocalDate date;

    @NotBlank(message = "Description cannot be empty.")
    private String description;

    @NotNull(message = "Category ID is required.")
    private Long categoryId;

    @NotNull(message = "User ID is required.")
    private Long userId;

    // Default constructor required for Jackson deserialization
    @SuppressWarnings("unused")
    public TransactionDto() {
    }

    // All-args constructor
    @SuppressWarnings("unused")
    public TransactionDto(
            Long id,
            BigDecimal amount,
            LocalDate date,
            String description,
            Long categoryId,
            Long userId
    ) {
        this.id = id;
        this.amount = amount;
        this.date = date;
        this.description = description;
        this.categoryId = categoryId;
        this.userId = userId;
    }
}