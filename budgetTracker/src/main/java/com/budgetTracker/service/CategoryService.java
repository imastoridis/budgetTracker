package com.budgetTracker.service;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface defining the business contract for Category management.
 */
public interface CategoryService {
    /**
     * CREATE: Creates a new category, linking it to the specified user.
     *
     * @param categoryDto The Category object to save.
     * @param user        The User.
     * @return The saved Category object with its generated ID.
     */
    CategoryDto createCategory(CategoryDto categoryDto, User user);

    /**
     * UPDATE: Updates the category
     * <p>
     * * @param categoryId The ID of the category.
     *
     * @param categoryId  The ID of the category.
     * @param userId      The ID of the owning user.
     * @param categoryDto The updated category
     * @return The updated category entity.
     */
    CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto, Long userId);

    /**
     * GET ALL: Retrieves a list of all categories belonging to a specific user ID.
     *
     * @param userId The ID of the owning user.
     * @return A list of the user's categories.
     */
    List<CategoryDto> findUserCategories(Long userId);

    /**
     * GET ALL: Retrieves a list of all categories belonging to a specific user ID.
     *
     * @param userId The ID of the owning user.
     * @param date   The ID of the owning user.
     * @return A list of the user's categories.
     */
    List<CategoryDto> findUserCategoriesWithTransactionsTotal(Long userId, LocalDate date);

    /**
     * GET ONE: Finds a category by its ID, ensuring it belongs to the specified user.
     * This is critical for security checks before allowing an update or delete.
     *
     * @param categoryId The ID of the category.
     * @param userId     The ID of the owning user.
     * @return An Optional containing the Category if found and owned by the user.
     */
    Category findUserOneCategory(Long categoryId, Long userId);

    /**
     * Deletes the specified category entity.
     *
     * @param categoryId The ID of the category.
     * @param userId     The ID of the owning user.
     */
    void deleteCategory(Long categoryId, Long userId);
}