package com.budgetTracker.exception;

/**
 * Custom exception used to indicate that a requested resource (like a Transaction or Category)
 * does not exist or is not owned by the requesting user (resulting in a 401 UNAUTHORIZED status).
 */
public class AccessUnauthorizedException extends RuntimeException {

    public AccessUnauthorizedException(String message) {
        super(message);
    }
}
