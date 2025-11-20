// File: src/test/java/com/budgetTracker/repository/CategoryRepositoryTest.java

package com.budgetTracker.repository;

import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // Use real database config, or keep default H2
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User testUser;
    private User otherUser;

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

        // Setup categories for the main user
        Category cat1 = new Category();
        cat1.setName("Groceries");
        cat1.setUser(testUser);
        entityManager.persist(cat1);

        Category cat2 = new Category();
        cat2.setName("Rent");
        cat2.setUser(testUser);
        entityManager.persist(cat2);

        // Setup category for the other user (to test isolation)
        Category cat3 = new Category();
        cat3.setName("Entertainment");
        cat3.setUser(otherUser);
        entityManager.persist(cat3);

        entityManager.flush();
        entityManager.clear();
    }

    /**
     * Unit test - Find all categories for a user.
     */
    @Test
    void findByUserId_shouldReturnOnlyUsersCategories() {
        // Act
        List<Category> categories = categoryRepository.findByUserId(testUser.getId());

        // Assert
        assertThat(categories).isNotNull();
        assertThat(categories).hasSize(2);
        assertThat(categories.get(0).getName()).isIn("Groceries", "Rent");
        assertThat(categories.get(1).getUser().getId()).isEqualTo(testUser.getId());
    }

    /**
     * Unit test - Find a category by ID and user ID when owned.
     */
    @Test
    void findByIdAndUserId_shouldReturnCategoryWhenOwned() {
        // Arrange
        // Get the ID of one of the test user's categories
        Category userCat = categoryRepository.findByUserId(testUser.getId()).getFirst();

        // Act
        Optional<Category> foundCategory = categoryRepository.findByIdAndUserId(userCat.getId(), testUser.getId());

        // Assert
        assertThat(foundCategory).isPresent();
        assertThat(foundCategory.get().getUser().getId()).isEqualTo(testUser.getId());
    }

    /**
     * Unit test - Find a category by ID and user ID when not owned.
     */
    @Test
    void findByIdAndUserId_shouldReturnEmptyWhenNotOwned() {
        // Arrange
        // Get the ID of the other user's category
        Category otherUserCat = categoryRepository.findByUserId(otherUser.getId()).getFirst();

        // Act: Try to find the other user's category using the main user's ID
        Optional<Category> foundCategory = categoryRepository.findByIdAndUserId(otherUserCat.getId(), testUser.getId());

        // Assert
        assertThat(foundCategory).isEmpty();
    }

    /**
     * Unit test - Find a category by ID and user ID when not found.
     */
    @Test
    void findByIdAndUserId_shouldReturnEmptyWhenNotFound() {
        // Act
        Optional<Category> foundCategory = categoryRepository.findByIdAndUserId(9999L, testUser.getId());

        // Assert
        assertThat(foundCategory).isEmpty();
    }
}