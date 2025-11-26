// File: src/test/java/com/budgetTracker/GlobalExceptionHandlerTest.java

package com.budgetTracker;

import com.budgetTracker.controller.CategoryController;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.exception.ResourceNotFoundException;
import com.budgetTracker.service.CategoryService;
import com.budgetTracker.service.UserService;
import com.budgetTracker.util.JwtTokenProvider;
import com.budgetTracker.util.SecurityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = CategoryController.class,
        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.budgetTracker\\.config\\.SecurityConfig")
)// Target a controller that uses the service
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- Mocks required by CategoryController's dependencies ---
    @MockBean
    private CategoryService categoryService;
    @MockBean
    private SecurityUtils securityUtils;

    // --- Mocks required by Security Infrastructure (JwtAuthenticationFilter) ---
    @MockBean
    private UserService userService;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private static final String API_PATH = "/api/categories";
    private static final Long USER_ID = 1L;
    private static final Long MOCK_CATEGORY_ID = 10L;

    /**
     * ResourceNotFoundException (404) Test: If category does not exist
     *
     * @throws Exception ResourceNotFoundException
     */
    @Test
    void handleResourceNotFoundException_shouldReturn404NotFound() throws Exception {
        long NON_EXISTENT_CATEGORY_ID = 99L;
        String NON_EXISTENT_CATEGORY_NAME = "Category not found with ID:" + NON_EXISTENT_CATEGORY_ID;
        // Mock security to return a user ID
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);

        // Arrange: Mock the service to throw the exception when trying to delete
        doThrow(new ResourceNotFoundException(NON_EXISTENT_CATEGORY_NAME))
                .when(categoryService).
                deleteCategory(eq(NON_EXISTENT_CATEGORY_ID), eq(USER_ID));

        // Act & Assert: Call the DELETE endpoint with an ID that the service will reject
        mockMvc.perform(delete(API_PATH + "/{id}", NON_EXISTENT_CATEGORY_ID)
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(categoryService).deleteCategory(NON_EXISTENT_CATEGORY_ID, USER_ID);
    }

    /**
     * AccessDeniedException (403) Test: If user does not own the category
     *
     * @throws Exception AccessDeniedException
     */
    @Test
    void handleAccessDeniedException_shouldReturn403Forbidden() throws Exception {
        // Mock security to return a user ID
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);

        // Arrange: Mock the service to throw the exception when trying to update
        doThrow(new AccessDeniedException("User 1 does not own category " + MOCK_CATEGORY_ID))
                .when(categoryService).updateCategory(eq(MOCK_CATEGORY_ID), any(), eq(USER_ID));

        // Setup a dummy DTO for the PUT request body
        String requestBody = "{\"id\": 10, \"name\": \"New Name\", \"userId\": 1}";

        // Act & Assert: Call the PUT endpoint
        mockMvc.perform(put(API_PATH + "/{id}", MOCK_CATEGORY_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden()); // Expect HTTP 403
    }
}