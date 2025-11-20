// File: src/test/java/com/budgetTracker/service/impl/CategoryServiceImplTest.java

package com.budgetTracker.service.impl;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.exception.AccessDeniedException;
import com.budgetTracker.exception.ResourceNotFoundException;
import com.budgetTracker.mapper.CategoryMapper;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests
 */
@ExtendWith(MockitoExtension.class)
@SuppressWarnings("unused")
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    // Inject mocks into the service implementation
    @InjectMocks
    private CategoryServiceImpl categoryService;

    // --- Common Test Data ---
    private User testUser;
    private Category category1;
    private CategoryDto categoryDto1; // Now includes ID

    @BeforeEach
    void setUp() {
        // Initialize common data
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        category1 = new Category();
        category1.setId(10L); // <-- ID added to Entity
        category1.setName("Groceries");
        category1.setUser(testUser);

        // Ensure categoryDto1 also has the ID for reference
        categoryDto1 = CategoryMapper.toDto(category1);
        // Note: CategoryMapper.toDto() now correctly sets the ID
    }

    // --- Test Cases ---

    @Test
    void createCategory_shouldSaveAndReturnDto() {
        // Arrange
        // Input DTO doesn't have an ID (it's new)
        CategoryDto inputDto = new CategoryDto(null, "Travel", testUser.getId());

        // Mock the repository save operation to return the entity *with* the generated ID (10L)
        when(categoryRepository.save(any(Category.class))).thenReturn(category1);

        // Act
        CategoryDto resultDto = categoryService.createCategory(inputDto, testUser);

        // Assert
        assertNotNull(resultDto);
        assertEquals(category1.getName(), resultDto.getName());
        assertEquals(category1.getId(), resultDto.getId());
        assertEquals(testUser.getId(), resultDto.getUserId());

        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void findUserCategories_shouldReturnList() {
        // Arrange
        List<Category> categoryList = Arrays.asList(category1);
        when(categoryRepository.findByUserId(1L)).thenReturn(categoryList);

        // Act
        List<CategoryDto> result = categoryService.findUserCategories(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(category1.getName(), result.get(0).getName());
        assertEquals(category1.getId(), result.get(0).getId()); //
        verify(categoryRepository, times(1)).findByUserId(1L);
    }

    @Test
    void findUserCategories_shouldThrowNoSuchElementException_whenNoCategoriesFound() {
        // Arrange
        when(categoryRepository.findByUserId(99L)).thenReturn(Collections.emptyList());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> {
            categoryService.findUserCategories(99L);
        });
        verify(categoryRepository, times(1)).findByUserId(99L);
    }

    @Test
    void findUserOneCategory_shouldReturnCategory() {
        // Arrange
        when(categoryRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(category1));

        // Act
        Category result = categoryService.findUserOneCategory(10L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(category1.getId(), result.getId());
        verify(categoryRepository, times(1)).findByIdAndUserId(10L, 1L);
    }

    @Test
    void findUserOneCategory_shouldThrowResourceNotFoundException() {
        // Arrange
        when(categoryRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            categoryService.findUserOneCategory(99L, 1L);
        });
    }

    @Test
    void updateCategory_shouldUpdateNameAndReturnDto() {
        // Arrange
        CategoryDto updateDto = new CategoryDto(10L, "New Name", 1L);

        // Mock repository to return existing category for find
        when(categoryRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(category1));

        // Mock repository to return the updated category after save
        Category updatedEntity = new Category();
        updatedEntity.setId(10L);
        updatedEntity.setName("New Name");
        updatedEntity.setUser(testUser);

        when(categoryRepository.save(any(Category.class))).thenReturn(updatedEntity);

        // Act
        CategoryDto result = categoryService.updateCategory(10L, updateDto, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("New Name", result.getName());
        verify(categoryRepository, times(1)).findByIdAndUserId(10L, 1L);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategory_shouldCallRepositoryDelete() {
        // Arrange
        when(categoryRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(category1));

        // Act
        categoryService.deleteCategory(10L, 1L);

        // Assert
        verify(categoryRepository, times(1)).findByIdAndUserId(10L, 1L);
        verify(categoryRepository, times(1)).delete(category1);
    }

    @Test
    void deleteCategory_shouldThrowResourceNotFoundException() {
        // Arrange
        when(categoryRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            categoryService.deleteCategory(99L, 1L);
        });
        verify(categoryRepository, never()).delete(any(Category.class));
    }

}