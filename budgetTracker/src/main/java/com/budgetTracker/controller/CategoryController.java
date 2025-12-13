package com.budgetTracker.controller;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.service.CategoryService;
import com.budgetTracker.service.TransactionService;
import com.budgetTracker.util.JsonUtils;
import com.budgetTracker.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@SuppressWarnings("unused")
public class CategoryController {

    private final SecurityUtils securityUtils;
    private final CategoryService categoryService;
    private final TransactionService transactionService;

    @Autowired
    public CategoryController(SecurityUtils securityUtils, CategoryService categoryService, TransactionService transactionService) {
        this.securityUtils = securityUtils;
        this.categoryService = categoryService;
        this.transactionService = transactionService;
    }

    // --- CRUD Endpoints ---

    /**
     * POST /api/categories: Creates a new category for the authenticated user.
     *
     * @return the new category dto
     * @RequestBody The new category
     */
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(
            @Valid @RequestBody CategoryDto categoryDto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        log.info("CategoryController::createCategory request body {}", JsonUtils.toJsonString(categoryDto));

        //Get the authenticated User entity
        User user = securityUtils.getAuthenticatedUser(userDetails);

        //Set fields and Save
        CategoryDto savedCategoryDto = categoryService.createCategory(categoryDto, user);

        log.info("CategoryController::createCategory response {}", JsonUtils.toJsonString(savedCategoryDto));

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedCategoryDto.getId())
                .toUri();

        return ResponseEntity.created(location).body(savedCategoryDto);
    }

    /**
     * GET /api/categories: Retrieves all categories belonging to the authenticated user.
     *
     * @return the categories dto associated with the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        List<CategoryDto> categories = categoryService.findUserCategories(userId);

        return ResponseEntity.ok(categories);
    }

    /**
     * PUT /api/categories/{id} : Updates a category
     *
     * @param id : category id
     * @return the updated category Dto
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto categoryDto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        CategoryDto updatedCategoryDto = categoryService.updateCategory(id, categoryDto, userId);

        return ResponseEntity.ok(updatedCategoryDto);
    }

    /**
     * DELETE /api/categories/{id}: Deletes a Category by ID. Enforces user ownership.
     *
     * @param id : category id
     * @return Void
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        categoryService.deleteCategory(id, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/categories/has-transactions/id: Retrieves all categories belonging to the authenticated user.
     *
     * @return the categories dto associated with the logged-in user
     */
    @GetMapping("/has-transactions/{id}")
    public ResponseEntity<Boolean> hasTransactions(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean hasTransactions = true;
        Long userId = securityUtils.getAuthenticatedUserId(userDetails);
        List<TransactionDto> transactions = transactionService.findCategoryTransactions(userId, id);
//Return 204 no content?
        if (transactions.isEmpty()) {
            hasTransactions = false;
        }
        return ResponseEntity.ok(hasTransactions);
    }
}