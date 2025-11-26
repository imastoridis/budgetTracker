// File: src/test/java/com/budgetTracker/SecurityIntegrationTest.java

package com.budgetTracker;

import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.CategoryRepository;
import com.budgetTracker.repository.UserRepository;
import com.budgetTracker.util.JsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Security & Full Integration Test
 * Calls real controller
 */
// Loads the entire application context
@SpringBootTest
@AutoConfigureMockMvc // Configures MockMvc
@Transactional // Ensures tests are isolated (database changes are rolled back)
@Slf4j
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- Test User Setup ---
    private final String TEST_USERNAME = "test_user";
    private User authenticatedUser; // Store the real User entity
    @BeforeEach
    void setup() {
        // 1. Setup: Ensure a user exists in the database
        authenticatedUser = userRepository.findByUsername(TEST_USERNAME)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(TEST_USERNAME);
                    // Use a real hash or placeholder hash if necessary
                    newUser.setPasswordHash("$2a$10$UcGfIQRv0REOf2R5ppaIYufAURQE8RNxHHTRcrh3QSh1yuSXtVy92");
                    return userRepository.save(newUser);
                });

        // 2. Add a test category for the user so the GET endpoint returns content
        if (categoryRepository.findByUserId(authenticatedUser.getId()).isEmpty()) {
            Category category = new Category();
            category.setName("Test Category");
            category.setUser(authenticatedUser);
            categoryRepository.save(category);
        }

        // Ensure data is flushed to the database for visibility
        userRepository.flush();
    }

    // --- Test Cases ---
    @Test
    void protectedEndpoint_shouldReturn401_whenUnauthenticated() throws Exception {
        // Act & Assert: Try to access a protected resource without authentication
        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized()); // Expect HTTP 401
    }

}