package com.budgetTracker.annotation;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to centralize cache eviction logic.
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Caching(evict = {
        @CacheEvict(value = "user_transactions_category_totals", allEntries = true),
        @CacheEvict(value = "user_transactions", allEntries = true),
        @CacheEvict(value = "category_transactions_income_by_month", allEntries = true),
        @CacheEvict(value = "category_transactions_expense_by_month", allEntries = true),
        @CacheEvict(value = "category_transactions", allEntries = true),
        @CacheEvict(value = "category_transactions_by_month", allEntries = true),
        @CacheEvict(value = "single_transaction", allEntries = true),
        @CacheEvict(value = "user_categories", allEntries = true),
        @CacheEvict(value = "user_categories_totals", allEntries = true),
        @CacheEvict(value = "user_monthly_totals", allEntries = true)
})
public @interface EvictTransactionCache {
}