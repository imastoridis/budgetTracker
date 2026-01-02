package com.budgetTracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseTransactionsDto(
        Long id,
        BigDecimal amount,
        LocalDate date,
        String description,
        String categoryName
) {
}