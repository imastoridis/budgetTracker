package com.budgetTracker.service;

import com.budgetTracker.dto.TransactionDataDto;
import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.model.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Interface defining the business contract for Transaction management.
 */
public interface TransactionService {

    /**
     * Creates a transaction entity.
     *
     * @param transactionDto The Transaction object to save.
     * @param user           The user.
     * @return The saved Transaction object.
     */
    TransactionDataDto createTransaction(TransactionDto transactionDto, User user);

    /**
     * UPDATE: Updates the transaction
     *
     * @param transactionId  The ID of the transaction.
     * @param transactionDto The updated transaction
     * @param user           The user.
     * @return The updated transaction entity.
     */
    TransactionDataDto updateTransaction(Long transactionId, TransactionDto transactionDto, User user);

    /**
     * GET ALL: Retrieves a list of all transactions belonging to a specific user ID.
     *
     * @param userId The ID of the owning user.
     * @return A list of the user's transactions.
     */
    List<TransactionDto> findUserTransactions(Long userId);

    /**
     * GET ALL: Retrieves a list of all transactions belonging to a specific category ID.
     *
     * @param userId     The ID of the owning user.
     * @param categoryId The ID of the category.
     * @return A list of the user's transactions.
     */
    List<TransactionDto> findUserTransactionsByCategoryId(Long userId, Long categoryId);

    /**
     * GET ALL: Retrieves a list of all transactions belonging to a specific category ID by a chosen month.
     *
     * @param userId     The ID of the owning user.
     * @param categoryId The ID of the category.
     * @param date       The chosen month
     * @return A list of the user's transactions.
     */
    List<TransactionDataDto> findUserTransactionsByCategoryIdAndMonth(Long userId, Long categoryId, LocalDate date);

    /**
     * GET ALL: Retrieves a list of all income transactions by a chosen month.
     *
     * @param userId The ID of the owning user.
     * @param date   The chosen month
     * @return A list of the user's income transactions.
     */
    List<TransactionDataDto> findUserIncomeTransactionsByMonth(Long userId, LocalDate date);

    /**
     * GET ALL: Retrieves a list of all expense transactions by a chosen month.
     *
     * @param userId The ID of the owning user.
     * @param date   The chosen month
     * @return A list of the user's transactions.
     */
    List<TransactionDataDto> findUserExpenseTransactionsByMonth(Long userId, LocalDate date);

    /**
     * Deletes the specified transaction entity.
     *
     * @param transactionId The ID of the transaction.
     * @param userId        The ID of the owning user.
     */
    void deleteTransaction(Long transactionId, Long userId);

    /**
     * Get total income
     *
     * @param date   Date
     * @param userId The ID of the owning user.
     */
    BigDecimal findSumIncomeByMonthByUserIdAndDate(Long userId, LocalDate date);

    /**
     * Get total expense
     *
     * @param userId The ID of the owning user.
     * @param date   Date
     *
     */
    BigDecimal findSumExpenseByUserIdAndMonth(Long userId, LocalDate date);
}