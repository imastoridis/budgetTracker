package com.budgetTracker.util; // Confirmed util package

import com.budgetTracker.model.entity.User;
import com.budgetTracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.budgetTracker.exception.AccessUnauthorizedException;

/**
 * Utility service for common security-related tasks, such as retrieving the
 * authenticated User entity from the security principal.
 */
@Service
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the fully-fledged User entity associated with the currently authenticated principal.
     *
     * @param userDetails The principal object provided by Spring Security.
     * @return The User entity.
     */
    public User getAuthenticatedUser(UserDetails userDetails) {
        return validateAuthenticatedUser(userDetails);
    }

    /**
     * Retrieves user id of authenticated principal
     *
     * @param userDetails The principal object provided by Spring Security.
     * @return The User id.
     */
    public Long getAuthenticatedUserId(UserDetails userDetails) {

        User user = validateAuthenticatedUser(userDetails);
        return user.getId();
    }

    /**
     * Validates that the user is logged-in and that he exists in db
     *
     * @param userDetails The principal object provided by Spring Security.
     * @return User
     * @throws AccessUnauthorizedException if the user cannot be found (should generally not happen if authenticated).
     */
    public User validateAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication details not provided.");
        }

        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found based on username: " + userDetails.getUsername()));
    }
}