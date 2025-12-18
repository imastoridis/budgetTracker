package com.budgetTracker.service;

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
    TransactionDto createTransaction(TransactionDto transactionDto, User user);

    /**
     * UPDATE: Updates the transaction
     *
     * @param transactionId  The ID of the transaction.
     * @param transactionDto The updated transaction
     * @param user           The user.
     * @return The updated transaction entity.
     */
    TransactionDto updateTransaction(Long transactionId, TransactionDto transactionDto, User user);

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
     * @param userId The ID of the owning user.
     * @param categoryId The ID of the category.
     * @return A list of the user's transactions.
     */
    List<TransactionDto> findUserTransactionsByCategoryId(Long userId, Long categoryId);


    /**
     * GET: Retrieves total amount of transactions belonging to a specific category ID.
     *
     * @param userId The ID of the owning user.
     * @param categoryId The ID of the category.
     * @return A list of the user's transactions.
     */
    BigDecimal findTransactionsTotalAmountByCategoryId(Long userId, Long categoryId, LocalDate date);

    /**
     * GET ONE: Finds a transaction by its ID, ensuring it belongs to the specified user.
     * This is critical for security checks before allowing an update or delete.
     *
     * @param transactionId The ID of the transaction.
     * @param userId        The ID of the owning user.
     * @return An Optional containing the Transaction if found and owned by the user.
     */
    TransactionDto findUserOneTransaction(Long transactionId, Long userId);

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
    BigDecimal getTotalIncomeByUserIdAndMonth(Long userId, LocalDate date);

    /**
     * Get total expense
     *
     * @param userId The ID of the owning user.
     * @param date   Date
     *
     */
    BigDecimal getTotalExpenseByUserIdAndMonth(Long userId, LocalDate date);
}