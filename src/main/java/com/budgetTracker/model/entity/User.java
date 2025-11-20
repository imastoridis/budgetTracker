package com.budgetTracker.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Maps this class to the 'users' table in the database
@Entity
@Table(name = "users")
public class User {

    /**
     * Unique identifier for the user (Primary Key).
     * The database automatically generates this value (IDENTITY strategy).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SuppressWarnings("unused")
    private Long id;

    // The username is typically used for login and is indexed in the database
    private String username;

    // User's email address
    private String email;

    // Stores the securely hashed password
    private String passwordHash;

    // --- Constructors ---
    public User() {
        // Default constructor required by JPA
    }

    //Constructor for creating new User instances.
    public User(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }


    // --- Getters and Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    // Note: No setter for ID since it's auto-generated
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    /**
     * Helper method required by Spring Security for user details.
     * Since we are using UserDetails from the service layer, this is kept simple.
     * In a full implementation, this might return user roles/authorities.
     */
    public Object getAuthorities() {
        return null; // For simplicity in this DTO, authorities are handled in UserService
    }
}