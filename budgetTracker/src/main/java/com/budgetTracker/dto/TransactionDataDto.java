package com.budgetTracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionDataDto(
        Long id,
        BigDecimal amount,
        LocalDate date,
        String description,
        Long categoryId,
        String categoryName
) {
    public Long getId() {
        return id;
    }
}