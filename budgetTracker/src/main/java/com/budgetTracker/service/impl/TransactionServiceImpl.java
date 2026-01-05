package com.budgetTracker.service.impl;

import com.budgetTracker.annotation.EvictTransactionCache;
import com.budgetTracker.dto.TransactionDataDto;
import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.exception.ResourceNotFoundException;
import com.budgetTracker.mapper.TransactionMapper;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.Transaction;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.TransactionRepository;
import com.budgetTracker.service.CategoryService;
import com.budgetTracker.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;


@Slf4j
@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;

    @Autowired
    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            CategoryService categoryService
    ) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
    }

    /**
     * GET a transaction entity by ID for a specific user.
     *
     * @param transactionId The ID of the category.
     * @param userId        The ID of the user who owns the category.
     * @return The found transaction entity.
     * @throws ResourceNotFoundException no category with the given ID is found.
     * @throws AccessDeniedException     if the category is found but does not belong to the user.
     */
    private Transaction validateTransactionOwnedByUser(Long transactionId, Long userId) {
        // Find the existing transaction by id
        return transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseGet(() -> {
                    // Check if user owns Transaction
                    if (transactionRepository.existsById(transactionId)) {
                        throw new AccessDeniedException("Access denied: Transaction does not belong to the authenticated user.");
                    }
                    //If Transaction it doesn't exist, throw 404
                    throw new ResourceNotFoundException("Transaction not found with ID: " + transactionId);
                });
    }

    /**
     * Creates a new category.
     *
     * @param transactionDto The new category.
     * @param user           The user.
     * @return The new transaction entity for the logged-in user.
     */
    @Override
    @EvictTransactionCache
    public TransactionDataDto createTransaction(TransactionDto transactionDto, User user) {
        Category category = categoryService.findUserOneCategory(transactionDto.getCategoryId(), user.getId());

        Transaction newTransaction = TransactionMapper.toEntity(transactionDto, user, category);
        Transaction savedTransaction = transactionRepository.save(newTransaction);

        return TransactionMapper.toRecord(savedTransaction, category);
    }

    /**
     * UPDATE : Updates a transaction
     *
     * @param transactionDto The updated transaction
     * @param user           The userId.
     * @return The updated transaction entity.
     */
    @Override
    @EvictTransactionCache
    public TransactionDataDto updateTransaction(Long transactionId, TransactionDto transactionDto, User user) {
        // Validate ownership and existence
        Transaction existingTransaction = validateTransactionOwnedByUser(transactionDto.getId(), user.getId());

        Category category = categoryService.findUserOneCategory(transactionDto.getCategoryId(), user.getId());

        // Update fields and save
        Transaction updatedTransactionEntity = TransactionMapper.toEntityUpdate(existingTransaction, transactionDto, category);
        Transaction updatedTransaction = transactionRepository.save(updatedTransactionEntity);

        return TransactionMapper.toRecord(updatedTransaction, category);
    }

    /**
     * Deletes a transaction.
     *
     * @param transactionId The ID of the transaction.
     * @param userId        The ID of the owning user.
     */
    @Override
    @EvictTransactionCache
    public void deleteTransaction(Long transactionId, Long userId) {
        //Find the existing transaction and verify ownership/existence
        Transaction transactionToDelete = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or access denied."));

        transactionRepository.delete(transactionToDelete);
    }

    /**
     * GET ALL: Retrieves all transactions for a given user.
     *
     * @param userId The userId
     * @return The new transactionDto for the logged-in user.
     * @throws NoSuchElementException no category with the given ID is found.
     */
    @Override
    @Cacheable(value = "user_transactions", key = "#userId")
    public List<TransactionDto> findUserTransactions(Long userId) {
        List<Transaction> transactionsEntities = transactionRepository.findByUserId(userId);

        if (transactionsEntities.isEmpty()) {
            throw new NoSuchElementException("No transactions for this user");
        } else {
            // Map each User entity to a TransactionDto
            return transactionsEntities.stream()
                    .map(TransactionMapper::toDto)
                    .collect(Collectors.toList());
        }
    }

    /**
     * GET ALL: Retrieves all transactions for a given user by category id.
     *
     * @param userId     The userId
     * @param categoryId The categoryId
     * @return The transactionDto for the logged-in user.
     * @throws NoSuchElementException no category with the given ID is found.
     */
    @Override
    @Cacheable(value = "category_transactions", key = "#userId + '-' + #categoryId")
    public List<TransactionDto> findUserTransactionsByCategoryId(Long userId, Long categoryId) {
        return transactionRepository.findUserTransactionsByCategoryId(userId, categoryId, Sort.by(Sort.Direction.DESC, "date"));
    }

    /**
     * GET ALL: Retrieves all income transactions for a given user by category id and chosen month
     *
     * @param userId The userId
     * @param date   the chosen date
     * @return The TransactionDataDto for the logged-in user.
     */
    @Override
    @Cacheable(value = "category_transactions_income_by_month", key = "#userId + '-' + #date.getYear() + '-' + #date.getMonthValue()")
    public List<TransactionDataDto> findUserIncomeTransactionsByMonth(Long userId, LocalDate date) {
        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());

        return transactionRepository.findUserIncomeTransactionsByMonth(userId, startDate, endDate, Sort.by(Sort.Direction.DESC, "date"));
    }

    /**
     * GET ALL: Retrieves all expense transactions for a given user by category id and chosen month
     *
     * @param userId The userId
     * @param date   the chosen date
     * @return The transactionDto for the logged-in user.
     */
    @Override
    @Cacheable(value = "category_transactions_expense_by_month", key = "#userId + '-' + #date.getYear() + '-' + #date.getMonthValue()")
    public List<TransactionDataDto> findUserExpenseTransactionsByMonth(Long userId, LocalDate date) {

        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());

        return transactionRepository.findUserExpenseTransactionsByMonth(userId, startDate, endDate, Sort.by(Sort.Direction.DESC, "date"));
    }

    /**
     * GET ALL: Retrieves total income for a given user and month.
     *
     * @param userId The userId
     * @param date   The date
     * @return The total income
     */
    @Override
    public BigDecimal findSumIncomeByMonthByUserIdAndDate(Long userId, LocalDate date) {
        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());
        BigDecimal totalIncome = transactionRepository.findSumIncomeByMonthByUserIdAndDate(userId, startDate, endDate);

        return Objects.requireNonNullElseGet(totalIncome, () -> BigDecimal.valueOf(0));
    }

    /**
     * GET ALL: Retrieves total income for a given user and month.
     *
     * @param userId The userId
     * @param date   The date
     * @return The total expenses
     */
    @Override
    public BigDecimal findSumExpenseByUserIdAndMonth(Long userId, LocalDate date) {
        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());
        BigDecimal totalExpense = transactionRepository.findSumExpenseByUserIdAndMonth(userId, startDate, endDate);

        return Objects.requireNonNullElseGet(totalExpense, () -> BigDecimal.valueOf(0));
    }
}