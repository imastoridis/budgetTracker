package com.budgetTracker.controller;

import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.service.TransactionService;
import com.budgetTracker.util.JsonUtils;
import com.budgetTracker.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@SuppressWarnings("unused")
public class TransactionController {

    private final SecurityUtils securityUtils;
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(SecurityUtils securityUtils, TransactionService transactionService) {
        this.securityUtils = securityUtils;
        this.transactionService = transactionService;
    }

    // --- CRUD Endpoints ---

    /**
     * POST /api/transactions: Creates a new transaction for the authenticated user.
     *
     * @param transactionDto The DTO containing transaction details.
     * @return the new transaction dto
     */
    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(
            @RequestBody TransactionDto transactionDto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        log.info("CategoryController::createCategory request body {}", JsonUtils.toJsonString(transactionDto));

        // Get the authenticated User using the username principal
        User user = securityUtils.getAuthenticatedUser(userDetails);
        // Set fields and save
        TransactionDto saveTransactionDto = transactionService.createTransaction(transactionDto, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saveTransactionDto.getId())
                .toUri();

        return ResponseEntity.created(location).body(saveTransactionDto);
    }

    /**
     * GET /api/transactions: Retrieves all transactions for the currently authenticated user.
     *
     * @return the transactions associated with the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAllTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        List<TransactionDto> transactions = transactionService.findUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/by-category/{id}: Retrieves all transactions for the currently authenticated user.
     *
     * @return the transactions associated with the logged-in user
     */
    @GetMapping("/by-category/{id}")
    public ResponseEntity<List<TransactionDto>> getAllTransactionsByCategoryAndUserId(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        List<TransactionDto> transactions = transactionService.findUserTransactionsByCategoryId(userId, id);
        return ResponseEntity.ok(transactions);
    }

    /**
     * PUT /api/transactions/{id} : Updates a transaction
     *
     * @param id : transaction id
     * @return the updated transaction Dto
     */
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionDto transactionDto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = securityUtils.getAuthenticatedUser(userDetails);
        transactionDto.setId(id);
        TransactionDto updatedTransactionDto = transactionService.updateTransaction(id, transactionDto, user);
        return ResponseEntity.ok(updatedTransactionDto);
    }

    /**
     * Deletes a transaction by ID. Enforces user ownership.
     *
     * @param id : transaction id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        transactionService.deleteTransaction(id, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/transactions/total-income: retrieves the total income for the currently authenticated user.
     *
     * @param date :
     * @return the income associated with the logged-in user
     */
    @GetMapping("/total-income")
    public ResponseEntity<BigDecimal> getTotalIncomeByMonth(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        System.out.println("TEST");
        BigDecimal totalIncomeByMonth = transactionService.getTotalIncomeByUserIdAndMonth(userId, date);
        return ResponseEntity.ok(totalIncomeByMonth);
    }

    /**
     * GET /api/transactions/total-expense: retrieves the total expense for the currently authenticated user.
     *
     * @param date :
     * @return the expense associated with the logged-in user
     */
    @GetMapping("/total-expense")
    public ResponseEntity<BigDecimal> getTotalExpenseByMonth(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);

        BigDecimal totalExpenseByMonth = transactionService.getTotalExpenseByUserIdAndMonth(userId, date);
        return ResponseEntity.ok(totalExpenseByMonth);
    }
}
