package com.budgetTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Budget Tracker Spring Boot application.
 *
 * @SpringBootApplication: Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 * which is necessary to fully initialize the JPA context and enable DDL execution.
 */
@SpringBootApplication
public class BudgetTrackerApplication {

    public static void main(String[] args) {
        // This static method runs the Spring Boot application. It starts the application context and the embedded server (like Tomcat).
        SpringApplication.run(BudgetTrackerApplication.class, args);
    }
}