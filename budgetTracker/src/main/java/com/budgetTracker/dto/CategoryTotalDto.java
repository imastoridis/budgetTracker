package com.budgetTracker.dto;

import com.budgetTracker.model.enums.CategoryType;
import java.math.BigDecimal;

public record CategoryTotalDto(
        Long id,
        String name,
        CategoryType type,
        BigDecimal totalAmount
) {
}
