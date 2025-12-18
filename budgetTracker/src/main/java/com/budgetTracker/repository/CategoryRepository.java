package com.budgetTracker.repository;

import com.budgetTracker.dto.CategoryTotalDto;
import com.budgetTracker.model.entity.Category;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
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
     * Retrieves all Categories belonging to a specific User ID filtered by name with the total amount of transactions
     * belonging to a specific user within the month of the given date.
     *
     * @param userId    The ID of the authenticated user.
     * @param startDate Start month.
     * @param endDate   End month
     * @return The sum of all amounts (as BigDecimal).
     */

    @Query("SELECT new com.budgetTracker.dto.CategoryTotalDto(" +
            "c.id, " +
            "c.name, " +
            "c.type, " +
           // "SUM(COALESCE(t.amount, 0))) " + // COALESCE inside the SUM ensures a 0 value per row
            "COALESCE(SUM(t.amount), 0)) " +
            "FROM Category c " +
            "LEFT JOIN Transaction t ON t.category = c " +
            "AND t.date BETWEEN :startDate AND :endDate " +
            "WHERE c.user.id = :userId " +
            "GROUP BY c.id, c.name, c.type " +
            "ORDER BY c.name ASC")
    List<CategoryTotalDto> findByUserIdOrderByNameAscWithAmount(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

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