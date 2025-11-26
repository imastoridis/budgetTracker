package com.budgetTracker.controller;

import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.model.enums.TransactionType;
import com.budgetTracker.service.TransactionService;
import com.budgetTracker.service.UserService;
import com.budgetTracker.util.JsonUtils;
import com.budgetTracker.util.JwtTokenProvider;
import com.budgetTracker.util.SecurityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for TransactionController endpoints.
 * Security components required by the context are mocked out.
 */
@WebMvcTest(
        controllers = TransactionController.class,
        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.budgetTracker\\.config\\.SecurityConfig")
)
@Slf4j
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- Mocks required by TransactionController's dependencies ---
    @MockBean
    private TransactionService transactionService;
    @MockBean
    private SecurityUtils securityUtils;

    // --- Mocks required by Security Infrastructure (JwtAuthenticationFilter) ---
    @MockBean
    private UserService userService;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private static final String API_PATH = "/api/transactions";
    private static final Long USER_ID = 1L;
    private static final Long MOCK_TRANSACTION_ID = 1L;
    private static final Long MOCK_CATEGORY_ID = 10L;

    // DTO1
    private static final TransactionDto dto1 = new TransactionDto(
            MOCK_TRANSACTION_ID,
            new BigDecimal("180.00"),
            TransactionType.INCOME,
            LocalDate.of(2025, 11, 10),
            "Description 1",
            MOCK_CATEGORY_ID,
            USER_ID
    );

    // DTO2
    private static final TransactionDto dto2 = new TransactionDto(
            MOCK_TRANSACTION_ID,
            new BigDecimal("150.00"),
            TransactionType.EXPENSE,
            LocalDate.of(2025, 10, 10),
            "Description 2",
            MOCK_CATEGORY_ID,
            USER_ID
    );


    /**
     * Test Cases for GET /api/transactions: Retrieves all transactions for the currently authenticated user.
     */
    @Test
    void getUserTransactions_shouldReturnUserTransactions() throws Exception {
        // Arrange
        List<TransactionDto> transactionList = Arrays.asList(dto1, dto2);

        // Mock security to return a user ID
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);

        // Mock service call to return the list of transactions
        when(transactionService.findUserTransactions(USER_ID)).thenReturn(transactionList);

        // Act & Assert
        mockMvc.perform(get(API_PATH)
                        .with(user("testuser").roles("USER")) // Mock an authenticated user
                        .accept(MediaType.APPLICATION_JSON)) // Expect JSON response
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].amount").value("180.0"))
                .andExpect(jsonPath("$[0].type").value("INCOME"))
                .andExpect(jsonPath("$[0].date").value("2025-11-10"))
                .andExpect(jsonPath("$[0].description").value("Description 1"))
                .andExpect(jsonPath("$[0].categoryId").value(MOCK_CATEGORY_ID))
                .andExpect(jsonPath("$[0].userId").value(USER_ID));
    }

    /**
     * Test Cases for POST /api/transactions: Create a new transaction
     */
    @Test
    void createTransaction_shouldReturnCreatedTransactionAnd201() throws Exception {
        // Mock security and service calls
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        when(transactionService.createTransaction(any(TransactionDto.class), any())).thenReturn(dto1);

        // Act & Assert
        mockMvc.perform(post(API_PATH)
                        .with(user("testuser").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(MOCK_TRANSACTION_ID))
                .andExpect(jsonPath("$.amount").value("180.0"))
                .andExpect(jsonPath("$.type").value("INCOME"))
                .andExpect(jsonPath("$.date").value("2025-11-10"))
                .andExpect(jsonPath("$.description").value("Description 1"))
                .andExpect(jsonPath("$.categoryId").value(MOCK_CATEGORY_ID))
                .andExpect(jsonPath("$.userId").value(USER_ID));
    }

    /**
     * Test Cases for PUT /api/transactions/{id}: Update an existing transaction
     */
    @Test
    void updateTransaction_shouldReturnUpdatedTransactionAnd200() throws Exception {
        // Mock security and service calls
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        when(transactionService.updateTransaction(eq(MOCK_TRANSACTION_ID), any(TransactionDto.class), any()))
                .thenReturn(dto2);

        TransactionDto test = transactionService.updateTransaction(eq(MOCK_TRANSACTION_ID), any(TransactionDto.class), any());
        // log.info("updatedDto: {}", JsonUtils.toJsonString(test));

        // Act & Assert
        mockMvc.perform(put(API_PATH + "/{id}", MOCK_TRANSACTION_ID)
                        .with(user("testuser").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(MOCK_TRANSACTION_ID))
                .andExpect(jsonPath("$.amount").value("150.0"))
                .andExpect(jsonPath("$.type").value("EXPENSE"))
                .andExpect(jsonPath("$.date").value("2025-10-10"))
                .andExpect(jsonPath("$.description").value("Description 2"))
                .andExpect(jsonPath("$.categoryId").value(MOCK_CATEGORY_ID))
                .andExpect(jsonPath("$.userId").value(USER_ID));
    }

    /**
     * Test Cases for DELETE /api/transactions: Delete a transaction for an authenticated user
     */
    @Test
    void deleteTransaction_shouldReturnNoContent() throws Exception {
        // Arrange
        Long transactionId = 101L;

        // Mock security
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);

        // Act & Assert
        mockMvc.perform(delete(API_PATH + "/{id}", transactionId)
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    /**
     * Test Cases for DELETE /api/transactions: Delete a transaction when access is denied
     */
    @Test
    void deleteTransaction_shouldReturnForbidden_whenAccessDenied() throws Exception {
        // Arrange
        Long transactionId = 102L;

        // Mock security
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        // Mock service to throw access denied
        doThrow(new AccessDeniedException("Transaction not owned by user")).when(transactionService)
                .deleteTransaction(eq(transactionId), eq(USER_ID));

        // Act & Assert
        mockMvc.perform(delete(API_PATH + "/{id}", transactionId)
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }
}