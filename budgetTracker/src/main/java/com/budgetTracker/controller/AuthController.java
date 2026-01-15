package com.budgetTracker.controller;

import com.budgetTracker.dto.AuthRequest;
import com.budgetTracker.dto.AuthResponse;
import com.budgetTracker.model.entity.User;
import com.budgetTracker.service.UserService;
import com.budgetTracker.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles all authentication-related requests: registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@SuppressWarnings("unused")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;


    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Handles user registration.
     * Endpoint: POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest registerRequest) {
        // 1. Check if a user already exists
        if (userService.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        // 2. Create and save a new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());

        // Securely hash the password before saving
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        userService.saveUser(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    /**
     * Handles user login and returns a JWT on success.
     * Endpoint: POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest) {

        // 1. Authenticate the user credentials using the AuthenticationManager.
        // This validates the username and password against the UserService and PasswordEncoder.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2. Set the authenticated object in the security context.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate the JWT from the authenticated user details (which are guaranteed to be UserDetails).
        String jwt = tokenProvider.generateToken(authentication);

        // 4. Return the token to the client.
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}