package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI orderServiceOpenAPI() {
        Server localServer = new Server()
            .url("http://localhost:8081")
            .description("Local Development Server");

        Contact contact = new Contact()
            .name("Animal Shop Team")
            .email("support@animalshop.com");

        License license = new License()
            .name("MIT License")
            .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
            .title("Order Service API")
            .version("1.0.0")
            .description("REST API for managing orders in the Animal Shop")
            .contact(contact)
            .license(license);

        return new OpenAPI()
            .info(info)
            .servers(List.of(localServer));
    }
} 