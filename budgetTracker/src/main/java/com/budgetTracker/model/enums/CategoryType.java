package com.budgetTracker.model.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enumeration for the type of a financial transaction.
 * Ensures that a transaction is always categorized as either income or expense.
 */
public enum CategoryType {
    @JsonProperty("INCOME")
    INCOME,
    @JsonProperty("EXPENSE")
    EXPENSE
}