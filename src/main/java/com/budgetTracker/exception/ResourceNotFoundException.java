package com.budgetTracker.exception;

/**
 * Custom exception used to indicate that a requested resource (like a Transaction or Category)
 * does not exist or is not owned by the requesting user (resulting in a 404 NOT FOUND status).
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}