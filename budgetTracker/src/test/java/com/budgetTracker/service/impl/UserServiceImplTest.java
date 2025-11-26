// File: src/test/java/com/budgetTracker/service/impl/UserServiceImplTest.java


package com.budgetTracker.service.impl;

import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests
 */

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    // Inject the mock repository into the service instance
    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private final String TEST_USERNAME = "testuser";
    private final String TEST_PASSWORD_HASH = "$2a$10$HASHEDPASSWORD";
    private final Long TEST_USER_ID = 1L;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(TEST_USER_ID);
        testUser.setUsername(TEST_USERNAME);
        testUser.setPasswordHash(TEST_PASSWORD_HASH);
        // Note: You must ensure your User entity has a working setter/constructor for these fields
    }

    // --- 1. Spring Security loadUserByUsername Tests ---

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        // Arrange
        when(userRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userService.loadUserByUsername(TEST_USERNAME);

        // Assert
        assertNotNull(userDetails);
        assertEquals(TEST_USERNAME, userDetails.getUsername());
        assertEquals(TEST_PASSWORD_HASH, userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty());

        verify(userRepository, times(1)).findByUsername(TEST_USERNAME);
    }

    @Test
    void loadUserByUsername_shouldThrowUsernameNotFoundException_whenUserDoesNotExist() {
        // Arrange
        String nonExistentUsername = "unknown";
        when(userRepository.findByUsername(nonExistentUsername)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername(nonExistentUsername);
        });

        verify(userRepository, times(1)).findByUsername(nonExistentUsername);
    }

    // --- 2. Standard CRUD/Finder Tests ---

    @Test
    void getAllUsers_shouldReturnListOfUsers() {
        // Arrange
        User user2 = new User();
        user2.setId(2L);
        List<User> mockUsers = Arrays.asList(testUser, user2);
        when(userRepository.findAll()).thenReturn(mockUsers);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void saveUser_shouldReturnSavedUser() {
        // Arrange
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User savedUser = userService.saveUser(new User());

        // Assert
        assertNotNull(savedUser);
        assertEquals(TEST_USER_ID, savedUser.getId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void findById_shouldReturnUser_whenFound() {
        // Arrange
        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findById(TEST_USER_ID);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(TEST_USER_ID, result.get().getId());
        verify(userRepository, times(1)).findById(TEST_USER_ID);
    }

    @Test
    void findById_shouldReturnEmptyOptional_whenNotFound() {
        // Arrange
        Long nonExistentId = 99L;
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.findById(nonExistentId);

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void findByUsername_shouldReturnUser_whenFound() {
        // Arrange
        when(userRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findByUsername(TEST_USERNAME);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(TEST_USERNAME, result.get().getUsername());
        verify(userRepository, times(1)).findByUsername(TEST_USERNAME);
    }

    @Test
    void findByUsername_shouldReturnEmptyOptional_whenNotFound() {
        // Arrange
        String nonExistentUsername = "unknown";
        when(userRepository.findByUsername(nonExistentUsername)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.findByUsername(nonExistentUsername);

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername(nonExistentUsername);
    }
}