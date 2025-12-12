// File: src/test/java/com/budgetTracker/repository/TransactionRepositoryTest.java

package com.budgetTracker.repository;

import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.Transaction;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.model.enums.TransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User testUser;
    private User otherUser;
    private Category category;

    @BeforeEach
    void setup() {
        // Setup two test users
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@test.com");
        testUser = entityManager.persistAndFlush(testUser); // Save user to get ID

        otherUser = new User();
        otherUser.setUsername("otheruser");
        otherUser.setEmail("other@test.com");
        otherUser = entityManager.persistAndFlush(otherUser);

        // Setup category for the main user
        category = new Category();
        category.setName("Groceries");
        category.setUser(testUser);
        entityManager.persist(category);

        // Setup Transaction for the main user
        Transaction tra1 = new Transaction();
        tra1.setAmount(BigDecimal.valueOf(150.00));
        tra1.setDate(LocalDate.parse("2025-09-10"));
        tra1.setDescription("test1");
        tra1.setUser(testUser);
        tra1.setCategory(category);
        entityManager.persist(tra1);

        Transaction tra2 = new Transaction();
        tra2.setAmount(BigDecimal.valueOf(180.00));
        tra2.setDate(LocalDate.parse("2025-08-10"));
        tra2.setDescription("test2");
        tra2.setUser(testUser);
        tra2.setCategory(category);
        entityManager.persist(tra2);

        // Setup Transaction for the other user
        Transaction tra3 = new Transaction();
        tra3.setAmount(BigDecimal.valueOf(180.00));
        tra3.setDate(LocalDate.parse("2025-08-10"));
        tra3.setDescription("test2");
        tra3.setUser(otherUser);
        tra3.setCategory(category);
        entityManager.persist(tra3);

        entityManager.flush();
        entityManager.clear();
    }

    /**
     * Unit test - Find all transactions for a user.
     */
    @Test
    void findByUserId_shouldReturnOnlyUsersTransactions() {
        // Act
        List<Transaction> transactions = transactionRepository.findByUserId(testUser.getId());

        // Assert
        assertThat(transactions).isNotNull();
        assertThat(transactions).hasSize(2); //Size of a list
        assertThat(transactions.getFirst().getAmount()).isIn(new BigDecimal("150.00"));
        assertThat(transactions.getFirst().getDate()).isIn(LocalDate.parse("2025-09-10"));
        assertThat(transactions.getFirst().getDescription()).isIn("test1");
        assertThat(transactions.getFirst().getCategory().getId()).isEqualTo(category.getId());
        assertThat(transactions.getFirst().getUser().getId()).isEqualTo(testUser.getId());

        assertThat(transactions.get(1).getAmount()).isIn(new BigDecimal("180.00"));
        assertThat(transactions.get(1).getDate()).isIn(LocalDate.parse("2025-08-10"));
        assertThat(transactions.get(1).getDescription()).isIn("test2");
        assertThat(transactions.get(1).getCategory().getId()).isEqualTo(category.getId());
        assertThat(transactions.get(1).getUser().getId()).isEqualTo(testUser.getId());

    }

    /**
     * Unit test - Find a transaction by ID and user ID when owned.
     */
    @Test
    void findByIdAndUserId_shouldReturnTransactionWhenOwned() {
        // Arrange
        // Get the ID of one of the test user's transactions
        Transaction userTra = transactionRepository.findByUserId(testUser.getId()).getFirst();

        // Act
        Optional<Transaction> foundTransaction = transactionRepository.findByIdAndUserId(userTra.getId(), testUser.getId());

        // Assert
        assertThat(foundTransaction).isPresent();
        assertThat(foundTransaction.get().getUser().getId()).isEqualTo(testUser.getId());
    }

    /**
     * Unit test - Find a transaction by ID and user ID when not owned.
     */
    @Test
    void findByIdAndUserId_shouldReturnEmptyWhenNotOwned() {
        // Arrange
        // Get the ID of the other user's transaction
        Transaction otherUserCat = transactionRepository.findByUserId(otherUser.getId()).getFirst();

        // Act: Try to find the other user's transaction using the main user's ID
        Optional<Transaction> foundTransaction = transactionRepository.findByIdAndUserId(otherUserCat.getId(), testUser.getId());

        // Assert
        assertThat(foundTransaction).isEmpty();
    }

    /**
     * Unit test - Find a transaction by ID and user ID when not found.
     */
    @Test
    void findByIdAndUserId_shouldReturnEmptyWhenNotFound() {
        // Act
        Optional<Transaction> foundTransaction = transactionRepository.findByIdAndUserId(9999L, testUser.getId());

        // Assert
        assertThat(foundTransaction).isEmpty();
    }
}