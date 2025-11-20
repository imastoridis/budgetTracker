package com.budgetTracker.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a spending or income category (e.g., Groceries, Rent, Salary).
 * Each category is owned by a single User.
 */
@Setter
@Getter
@Entity
@Table(
        name = "category",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"name", "user_id"}, name = "UK_category_user_name")
        }
)
public class Category {
    // --- Getters and Setters ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SuppressWarnings("unused")
    private Long id;

    // The name of the category (e.g., "Food", "Entertainment")
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Many Categories map to One User.
     *
     * @ManyToOne: Defines the relationship type.
     * @JoinColumn: Specifies the foreign key column name ('user_id').
     * FetchType.LAZY: Loads the User object only when explicitly accessed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- Constructors ---
    public Category() {
    }

}