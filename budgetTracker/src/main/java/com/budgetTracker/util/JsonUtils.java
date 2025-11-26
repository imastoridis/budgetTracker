package com.budgetTracker.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for common JSON operations, particularly for logging and debugging.
 */
public final class JsonUtils {

    // Use a static, final ObjectMapper instance for efficiency and thread safety
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(JsonUtils.class);


    // Static initialization block to configure the ObjectMapper
    static {
        // CRITICAL FIX: Register the JavaTimeModule to handle LocalDate, LocalDateTime, etc.
        OBJECT_MAPPER.registerModule(new JavaTimeModule());
        // Additional configuration can go here (e.g., to fail on unknown properties)
    }

    // Private constructor to prevent instantiation of the utility class
    private JsonUtils() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    /**
     * Serializes any Java object into its JSON string representation.
     * Useful for logging DTOs and entities in a readable format.
     * If serialization fails, it logs the error and returns a fallback string.
     *
     * @param obj The object to serialize.
     * @return The JSON string representation of the object, or a fallback error string.
     */
    public static String toJsonString(Object obj) {
        if (obj == null) {
            return "null";
        }
        try {
            // Use writerWithDefaultPrettyPrinter() for human-readable, indented output
            return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize object to JSON string for logging: {}", obj.getClass().getName(), e);
            // Return a safe, descriptive string in case of failure
            return String.format("[JSON_SERIALIZATION_ERROR: %s]", obj.getClass().getName());
        }
    }
}