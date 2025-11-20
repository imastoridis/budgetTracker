package com.budgetTracker.exception;

/**
 * Custom exception used to indicate that a requested resource (like a Transaction or Category)
 * does not exist or is not owned by the requesting user (resulting in a 403 ACCESS DENIED status).
 */

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
