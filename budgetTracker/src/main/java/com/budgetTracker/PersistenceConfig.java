package com.budgetTracker;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.budgetTracker.repository")
@SuppressWarnings("unused")
public class PersistenceConfig {
    // This class is now responsible for enabling JPA repositories.
}