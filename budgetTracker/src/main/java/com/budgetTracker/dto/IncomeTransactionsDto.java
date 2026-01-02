package com.budgetTracker.dto;

import com.budgetTracker.model.enums.CategoryType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeTransactionsDto(
        Long id,
        BigDecimal amount,
        LocalDate date,
        String description,
        Long categoryId,
        String categoryName
) {
}