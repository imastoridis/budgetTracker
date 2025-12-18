package com.budgetTracker.repository;

import com.budgetTracker.model.entity.Transaction;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Retrieves all Transactions associated with a specific User ID.
     */
    List<Transaction> findByUserId(Long userId);

    /**
     * Security method: Finds a Transaction by its ID AND ensures it belongs to the given user ID.
     * This prevents users from accessing transactions they don't own.
     */
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);


    /**
     * Finds all transactions belonging to a specific user and category
     *
     * @param userId     The ID of the authenticated user.
     * @param categoryId category Id
     * @return List of transactions
     */
    @Query("SELECT t " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND " +
            "t.category.id = :categoryId"
    )
    List<Transaction> findByUserIdAndCategoryId(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            Sort sort
    );

    /**
     * Finds the total sum of the 'amount' column for all income transactions
     * belonging to a specific user within the month of the given date.
     *
     * @param userId    The ID of the authenticated user.
     * @param startDate Start month.
     * @param endDate   End month
     * @return The sum of all amounts (as BigDecimal).
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND " +
            "t.category.id = :categoryId AND " +
            "t.date BETWEEN :startDate AND :endDate")
    BigDecimal findTransactionsTotalAmountByCategoryId(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Finds the total sum of the 'amount' column for all income transactions
     * belonging to a specific user within the month of the given date.
     *
     * @param userId    The ID of the authenticated user.
     * @param startDate Start month.
     * @param endDate   End month
     * @return The sum of all amounts (as BigDecimal).
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND " +
            "t.category.type = com.budgetTracker.model.enums.CategoryType.INCOME AND " +
            "t.date BETWEEN :startDate AND :endDate")
    BigDecimal findIncomeByMonthByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Finds the total sum of the 'amount' column for all expense transactions
     * belonging to a specific user within the month of the given date.
     *
     * @param userId    The ID of the authenticated user.
     * @param startDate Start month.
     * @param endDate   End month
     * @return The sum of all amounts (as BigDecimal).
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND " +
            "t.category.type = com.budgetTracker.model.enums.CategoryType.EXPENSE AND " +
            "t.date BETWEEN :startDate AND :endDate")
    BigDecimal findExpenseByMonthByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
