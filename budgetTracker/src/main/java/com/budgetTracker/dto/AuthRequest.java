package com.budgetTracker.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for handling login and registration requests.
 * Used to receive username, password and email from the client.
 */
@Schema(description = "Details about a user resource")
public class AuthRequest {

    @Schema(description = "Unique identifier of the user", example = "test_user")
    private String username;
    @Schema(description = "Hashed password of the user", example = "zadé&eqsdé464dqsz")
    private String password;
    @Schema(description = "Email of the user", example = "testuser@test.com")
    private String email;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}