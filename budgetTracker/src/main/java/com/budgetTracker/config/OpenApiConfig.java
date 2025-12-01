package com.budgetTracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for the OpenAPI 3 specification (Swagger UI).
 * Defines API metadata like title, version, and license information.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Budget Tracker API Documentation")
                        .version("1.0.0")
                        .description("REST API documentation for the Budget Tracker application, covering financial data, transactions, and user management.")
                        .contact(new Contact()
                                .name("Budget Tracker Team"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }
}