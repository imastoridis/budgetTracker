package com.budgetTracker.repository;

import com.budgetTracker.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    /**
     * Custom finder method: Retrieves all Categories belonging to a specific User ID.
     *
     * @param userId : the userId
     */
    List<Category> findByUserId(Long userId);

    /**
     * Custom finder method: Retrieves all Categories belonging to a specific User ID filtered by name.
     *
     * @param userId : the userId
     */
    List<Category> findByUserIdOrderByNameAsc(Long userId);

    /**
     * Security method: Finds a Category by its ID AND ensures it belongs to the given user ID.
     * This prevents users from accessing categories they don't own.
     */
    Optional<Category> findByIdAndUserId(Long id, Long userId);

    /**
     * Validation method: Checks if a category with the given name already exists for the user.
     * This supports business rule enforcement (unique name per user).
     */
    Optional<Category> findByNameAndUserId(String name, Long userId);

    /**
     * Check if an existing category (excluding the one being updated) has the same name for a given user. Used for update validation.
     */
    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(Long userId, String name, Long categoryId);
}