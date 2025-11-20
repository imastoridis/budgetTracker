package com.budgetTracker.controller;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.service.CategoryService;
import com.budgetTracker.service.UserService;
import com.budgetTracker.util.SecurityUtils;
import com.budgetTracker.util.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for CategoryController endpoints.
 * Security components required by the context are mocked out.
 */
@WebMvcTest(
        controllers = CategoryController.class,
        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.budgetTracker\\.config\\.SecurityConfig")
)
public class CategoryControllerTest {

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
    private static final Long MOCK_CATEGORY_ID = 100L;

    /**
     * Test Cases for GET /api/categories
     */
    @Test
    void getUserCategories_shouldReturnUserCategories() throws Exception {
        // Arrange
        CategoryDto cat1 = new CategoryDto(1L, "Food", USER_ID);
        CategoryDto cat2 = new CategoryDto(2L, "Rent", USER_ID);
        List<CategoryDto> categoryList = Arrays.asList(cat1, cat2);

        // Mock security to return a user ID
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);

        // Mock service call to return the list of categories
        when(categoryService.findUserCategories(USER_ID)).thenReturn(categoryList);

        // Act & Assert
        mockMvc.perform(get(API_PATH)
                        .with(user("testuser").roles("USER")) // Mock an authenticated user
                        .accept(MediaType.APPLICATION_JSON)) // Expect JSON response
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Food"))
                .andExpect(jsonPath("$[1].name").value("Rent"));
    }

    /**
     * Test Cases for POST /api/categories
     */
    @Test
    void createCategory_shouldReturnCreatedCategoryAnd201() throws Exception {
        // Arrange
        CategoryDto inputDto = new CategoryDto(null, "Groceries", null);
        CategoryDto createdDto = new CategoryDto(MOCK_CATEGORY_ID, "Groceries", USER_ID);

        // Mock security and service calls
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        when(categoryService.createCategory(any(CategoryDto.class), any())).thenReturn(createdDto);

        // Act & Assert
        mockMvc.perform(post(API_PATH)
                        .with(user("testuser").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(MOCK_CATEGORY_ID))
                .andExpect(jsonPath("$.name").value("Groceries"));
    }

    /**
     * Test Cases for PUT /api/categories/{id}
     */
    @Test
    void updateCategory_shouldReturnUpdatedCategoryAnd200() throws Exception {
        // Arrange
        CategoryDto updateInputDto = new CategoryDto(MOCK_CATEGORY_ID, "Groceries", USER_ID);
        CategoryDto updatedDto = new CategoryDto(MOCK_CATEGORY_ID, "Updated Groceries", USER_ID);

        // Mock security and service calls
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        when(categoryService.updateCategory(eq(MOCK_CATEGORY_ID), any(CategoryDto.class), eq(USER_ID)))
                .thenReturn(updatedDto);

        // Act & Assert
        mockMvc.perform(put(API_PATH + "/{id}", MOCK_CATEGORY_ID)
                        .with(user("testuser").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateInputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(MOCK_CATEGORY_ID))
                .andExpect(jsonPath("$.name").value("Updated Groceries"));
    }

    /**
     * Test Cases for DELETE /api/categories
     */
    @Test
    void deleteCategory_shouldReturnNoContent() throws Exception {
        // Arrange
        Long categoryId = 101L;

        // Mock security
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        // Mock service call (does not return anything, so no 'when')

        // Act & Assert
        mockMvc.perform(delete(API_PATH + "/{id}", categoryId)
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    /**
     * Test Cases for DELETE /api/categories when access is denied
     */
    @Test
    void deleteCategory_shouldReturnForbidden_whenAccessDenied() throws Exception {
        // Arrange
        Long categoryId = 102L;

        // Mock security
        when(securityUtils.getAuthenticatedUserId(any())).thenReturn(USER_ID);
        // Mock service to throw access denied
        doThrow(new AccessDeniedException("Category not owned by user")).when(categoryService)
                .deleteCategory(eq(categoryId), eq(USER_ID));

        // Act & Assert
        mockMvc.perform(delete(API_PATH + "/{id}", categoryId)
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }
}