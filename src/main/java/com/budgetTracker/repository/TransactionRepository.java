package com.budgetTracker.repository;

import com.budgetTracker.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Retrieves all Transactions associated with a specific User ID.
     * This is the primary way to fetch user-specific data.
     */
    List<Transaction> findByUserId(Long userId);

    /**
     * Security method: Finds a Transaction by its ID AND ensures it belongs to the given user ID.
     * This prevents users from accessing transactions they don't own.
     */
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
}
