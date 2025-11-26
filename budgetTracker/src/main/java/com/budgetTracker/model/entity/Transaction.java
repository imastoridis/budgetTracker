package com.budgetTracker.model.entity;

import com.budgetTracker.model.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a single transaction (income or expense).
 */
@Setter
@Getter
@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    // Could be "INCOME" or "EXPENSE"
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;

    @Column(nullable = false)
    private LocalDate date;

    private String description;

    // --- Relationships ---

    // Many transactions belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many transactions belong to one category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // --- Constructors ---
    public Transaction() {
    }

    public Transaction(
            BigDecimal amount,
            TransactionType type,
            LocalDate date,
            String description,
            User user,
            Category category
    ) {
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
        this.user = user;
        this.category = category;
    }
}