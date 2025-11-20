package com.budgetTracker.service;

import com.budgetTracker.model.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

/**
 * Interface defining the business contract for user management.
 */
public interface UserService {

    /**
     * Get all users.
     *
     * @return all users
     */
    List<User> getAllUsers();

    /**
     * GET ONE User by their username and returns a Spring Security UserDetails object.
     * Required by the UserDetailsService interface.
     *
     * @param username The username provided during login.
     * @return UserDetails object containing user's credentials and authorities.
     */
    UserDetails loadUserByUsername(String username);

    /**
     * Retrieves a User by their primary key ID.
     * Needed by controllers to link entities to the authenticated user.
     *
     * @param id userId
     * @return the user entity
     */
    Optional<User> findById(Long id);

    /**
     * Retrieves a User by their username.
     *
     * @param username :
     * @return the user entity
     */
    Optional<User> findByUsername(String username);

    /**
     * PUT : Saves a user.
     *
     * @param user the user entity
     * @return the saved user entity
     */
    User saveUser(User user);

}