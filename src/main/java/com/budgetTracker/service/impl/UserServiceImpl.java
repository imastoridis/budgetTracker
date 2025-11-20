package com.budgetTracker.service.impl;

import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.UserRepository;
import com.budgetTracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for User-related business logic.
 * Implements UserDetailsService, which is required by Spring Security
 * to load user-specific data during authentication.
 */
@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    @SuppressWarnings("unused")
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Required by the UserDetailsService interface.
     * Finds a User by their username and returns a Spring Security UserDetails object.
     *
     * @param username The username provided during login.
     * @return UserDetails object containing user's credentials and authorities.
     * @throws UsernameNotFoundException if the user does not exist.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                //orElse is needed because we put optional in repository
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                Collections.emptyList()
        );
    }

    // --- Additional Service Methods ---

    /**
     * Get all users.
     *
     * @return all users
     */
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Saves a user.
     *
     * @param user the user entity
     * @return the saved user entity
     */
    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Retrieves a User by their primary key ID.
     * Needed by controllers to link entities to the authenticated user.
     *
     * @param id userId
     * @return the user entity
     */
    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Retrieves a User by their username.
     *
     * @param username :
     * @return the user entity
     */
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
