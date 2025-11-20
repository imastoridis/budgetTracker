package com.budgetTracker.util;

//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jws;

import io.jsonwebtoken.JwtParser; // Import the parser interface
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utility class for generating and validating JSON Web Tokens (JWTs).
 * Uses the jjwt library for secure token handling.
 */
@Component
public class JwtTokenProvider {

    // Using a hardcoded key for demonstration.
    private final String jwtSecret = "ThisIsAVeryLongSecretKeyForTestingTheBudgetTrackerApp1234567890";

    // Key used for signing the token
    private final SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

    // JWT Parser object, initialized once for efficiency and to help compiler resolve methods
   // private final JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    private final JwtParser jwtParser = Jwts.parser().verifyWith(key).build();
    //private final JwtParser jwtParser = Jwts.builder().verifyWith(key).build();

    // Token expiration time in milliseconds (e.g., 24 hours)
    private final long jwtExpirationInMs = 86400000;

    /**
     * Generates a JWT based on the authenticated user's details.
     */
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                // Resolved setSubject() deprecation
                .claim("sub", userPrincipal.getUsername()) // Subject is the username
                .claim("iat", new Date())
                .claim("exp", expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Validates the JWT.
     */
    public boolean validateToken(String authToken) {
        try {
            // Use the pre-built parser object
            jwtParser.parseSignedClaims(authToken);
            return true;
        } catch (Exception ex) {
            // Log various JWT exception types here (malformed, expired, unsupported, etc.)
            System.out.println("JWT validation failed: " + ex.getMessage());
        }
        return false;
    }

    /**
     * Retrieves the username from the token's payload.
     */
    public String getUsernameFromJWT(String token) {
        // Use the pre-built parser object
        return jwtParser.parseSignedClaims(token)
                .getPayload()
                .get("sub", String.class);
    }
}