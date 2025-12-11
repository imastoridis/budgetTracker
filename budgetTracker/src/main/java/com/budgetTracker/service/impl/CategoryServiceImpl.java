package com.budgetTracker.service.impl;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.exception.DuplicateResourceException;
import com.budgetTracker.mapper.CategoryMapper;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.CategoryRepository;
import com.budgetTracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.exception.ResourceNotFoundException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

/**
 * Concrete implementation of the CategoryService interface.
 * Handles the core business logic for category CRUD operations.
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);
    private final CategoryRepository categoryRepository;

    // Cache name
    private static final String CATEGORY_CACHE = "userCategories";

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Finds a Category entity by its ID, ensuring it belongs to the given user ID.
     * Throws specific exceptions for 403 (Access Denied) or 404 (Not Found).
     *
     * @param categoryId The ID of the category.
     * @param userId     The ID of the owning user.
     * @return The Category entity if found and owned by the user.
     * @throws ResourceNotFoundException no category with the given ID is found.
     * @throws AccessDeniedException     if the category is found but does not belong to the user.
     */
    private Category validateCategoryOwnedByUser(Long categoryId, Long userId) {
        // Try to find the category owned by the authenticated user
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseGet(() -> {
                    //  If access failed, check if the resource exists at all (owned by someone else)
                    if (categoryRepository.existsById(categoryId)) {
                        throw new AccessDeniedException("Access denied: Category does not belong to the authenticated user.");
                    }
                    //  If it doesn't exist, throw 404
                    throw new ResourceNotFoundException("Category not found with ID: " + categoryId);
                });
    }

    /**
     * Creates a new category.
     * Uses @CacheEvict to remove the entire list of categories for this user
     *
     * @param categoryDto The new category.
     * @param user        The user.
     * @return The new category entity for the logged-in user.
     */
    @Override
    @CacheEvict(value = CATEGORY_CACHE, key = "#user.id")
    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto, User user) {
        Long userId = user.getId();
        String categoryName = categoryDto.getName();

        categoryRepository.findByNameAndUserId(categoryDto.getName(), userId)
                .ifPresent(c -> {
                    throw new DuplicateResourceException("Category name '" + categoryName + "' already exists for user ID " + userId);
                });

        //Set and save
        Category newCategory = CategoryMapper.toEntity(categoryDto, user);
        Category savedCategory = categoryRepository.save(newCategory);

        log.info("Category created with ID: {}. Evicting cache for user ID: {}", savedCategory.getId(), userId);

        // Transform the updated entity into its DTO representation
        return CategoryMapper.toDto(savedCategory);
    }

    /**
     * GET ALL: Retrieves all categories for a given user.
     * Uses @Cacheable to first check Redis. If found, returns the cached list;
     *
     * @param userId The ID of the user who owns the category.
     * @return The categoriesDto for the logged-in user.
     * @throws NoSuchElementException no category with the given ID is found.
     */
    @Override
    @Cacheable(value = CATEGORY_CACHE, key = "#userId")
    public List<CategoryDto> findUserCategories(Long userId) {
        log.info("Fetching all categories for user ID {} from database (not cache).", userId);
        List<Category> categoryEntities = categoryRepository.findByUserIdOrderByNameAsc(userId);

        if (categoryEntities.isEmpty()) {
            throw new NoSuchElementException("No categories for this user");
        } else {
            // Map each User entity to a CategoryDto
            return categoryEntities.stream()
                    .map(CategoryMapper::toDto)
                    .collect(Collectors.toList());
        }
        //  log.debug(categoryEntities);
    }

    /**
     * GET ONE: Finds a category by its ID, ensuring it belongs to the specified user.
     *
     * @param categoryId The ID of the category.
     * @param userId     The ID of the user who owns the category.
     * @return The category for the logged-in user.
     */
    @Override
    public Category findUserOneCategory(Long categoryId, Long userId) {
        return validateCategoryOwnedByUser(categoryId, userId);
    }

    /**
     * UPDATE: Updates a category.
     * Uses @CacheEvict to ensure the list cache for the user is updated.
     *
     * @param categoryId  The ID of the category.
     * @param userId      The ID of the owning user.
     * @param categoryDto The updated category
     * @return The updated Category entity.
     */
    @Override
    @CacheEvict(value = CATEGORY_CACHE, key = "#userId")
    @Transactional
    public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto, Long userId) {
        log.info("Category ID {} updated. Evicting cache for user ID: {}", categoryId, userId);
        // Validate ownership and existence
        Category existingCategory = validateCategoryOwnedByUser(categoryId, userId);

        // Validate uniqueness of the new name against other categories owned by the user
        String newName = categoryDto.getName();
        if (!existingCategory.getName().equalsIgnoreCase(newName) &&
                categoryRepository.existsByUserIdAndNameIgnoreCaseAndIdNot(userId, newName, categoryId)) {

            throw new DuplicateResourceException(String.format(
                    "Category name '%s' already exists for user ID %d", newName, userId));
        }

        // Update fields and save
        existingCategory.setName(categoryDto.getName());
        Category updatedCategory = categoryRepository.save(existingCategory);

        return CategoryMapper.toDto(updatedCategory);
    }

    /**
     * Deletes the specified category entity.
     * Uses @CacheEvict to ensure the list cache for the user is removed.
     *
     * @param categoryId The ID of the category.
     * @param userId     The ID of the owning user.
     */
    @Override
    @CacheEvict(value = CATEGORY_CACHE, key = "#userId")
    @Transactional
    public void deleteCategory(Long categoryId, Long userId) {
        log.info("Category ID {} deleted. Evicting cache for user ID: {}", categoryId, userId);
        // Find the existing category by id
        Category categoryToDelete = validateCategoryOwnedByUser(categoryId, userId);

        categoryRepository.delete(categoryToDelete);
    }


}