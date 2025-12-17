package com.budgetTracker.service.impl;

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
@SuppressWarnings("unused")
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
    public TransactionDto createTransaction(TransactionDto transactionDto, User user) {
        //Find category
        Category category = categoryService.findUserOneCategory(transactionDto.getCategoryId(), user.getId());

        Transaction newTransaction = TransactionMapper.toEntity(transactionDto, user, category);
        Transaction savedTransaction = transactionRepository.save(newTransaction);

        // Transform the updated entity into its DTO representation
        return TransactionMapper.toDto(savedTransaction);
    }

    /**
     * GET ALL: Retrieves all transactions for a given user.
     *
     * @param userId The userId
     * @return The new transactionDto for the logged-in user.
     * @throws NoSuchElementException no category with the given ID is found.
     */
    @Override
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
     * GET ALL: Retrieves all transactions for a given user by category Id.
     *
     * @param userId     The userId
     * @param categoryId The userId
     * @return The transactionDto for the logged-in user.
     * @throws NoSuchElementException no category with the given ID is found.
     */
    @Override
    public List<TransactionDto> findUserTransactionsByCategoryId(Long userId, Long categoryId) {
        List<Transaction> categoryEntities = transactionRepository.findByUserIdAndCategoryId(userId, categoryId, Sort.by(Sort.Direction.DESC, "date"));

        if (categoryEntities.isEmpty()) {
            return null;
        } else {
            return categoryEntities.stream()
                    .map(TransactionMapper::toDto)
                    .collect(Collectors.toList());

        }
    }

    /**
     * GET ONE: Finds a transaction by its ID, ensuring it belongs to the specified user.
     *
     * @param transactionId The ID of the transaction.
     * @param userId        The ID of the user who owns the category.
     * @return The categoryDto for the logged-in user.
     */
    @Override
    public TransactionDto findUserOneTransaction(Long transactionId, Long userId) {
        Transaction transaction = validateTransactionOwnedByUser(transactionId, userId);
        return TransactionMapper.toDto(transaction);
    }

    /**
     * UPDATE : Updates a transaction
     *
     * @param transactionDto The updated transaction
     * @param user           The userId.
     * @return The updated transaction entity.
     */
    @Override
    public TransactionDto updateTransaction(Long transactionId, TransactionDto transactionDto, User user) {
        // Validate ownership and existence
        Transaction existingTransaction = validateTransactionOwnedByUser(transactionDto.getId(), user.getId());

        //Find category
        Category category = categoryService.findUserOneCategory(transactionDto.getCategoryId(), user.getId());

        // Update fields and save
        Transaction updatedTransactionEntity = TransactionMapper.toEntityUpdate(existingTransaction, transactionDto, category);
        Transaction updatedTransaction = transactionRepository.save(updatedTransactionEntity);

        // Transform the updated entity into its DTO representation
        return TransactionMapper.toDto(updatedTransaction);
    }

    /**
     * Deletes a new transaction.
     *
     * @param transactionId The ID of the transaction.
     * @param userId        The ID of the owning user.
     */
    @Override
    public void deleteTransaction(Long transactionId, Long userId) {
        //Find the existing transaction and verify ownership/existence
        Transaction transactionToDelete = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or access denied."));

        transactionRepository.delete(transactionToDelete);
    }

    /**
     * GET ALL: Retrieves total income for a given user and month.
     *
     * @param userId The userId
     * @param date   The date
     * @return The total income
     */
    @Override
    public BigDecimal getTotalIncomeByUserIdAndMonth(Long userId, LocalDate date) {

        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());
        BigDecimal totalIncome = transactionRepository.findIncomeByMonthByUserIdAndDate(userId, startDate, endDate);

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
    public BigDecimal getTotalExpenseByUserIdAndMonth(Long userId, LocalDate date) {

        LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());
        BigDecimal totalExpense = transactionRepository.findExpenseByMonthByUserIdAndDate(userId, startDate, endDate);

        return Objects.requireNonNullElseGet(totalExpense, () -> BigDecimal.valueOf(0));
    }
}