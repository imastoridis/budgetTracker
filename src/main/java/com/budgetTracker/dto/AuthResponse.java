package com.budgetTracker.dto;

/**
 * Data Transfer Object for sending the JWT back to the client after successful login.
 */
public class AuthResponse {

    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}