// Trigger workflow test - OrderService
package com.example.demo;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(OrderRepository orderRepository) {
        return args -> {
            Order testOrder = new Order();
            testOrder.setCustomerName("Animal Shop Test Order");
            testOrder.setCustomerEmail("test@animalshop.com");
            testOrder.setShippingAddress("123 Pet Street, Zoo City");
            testOrder.setTotalAmount(new BigDecimal("299.99"));
            testOrder.setStatus("PENDING");
            testOrder.setOrderDate(LocalDateTime.now());
            testOrder.setLastUpdated(LocalDateTime.now());
            
            Order savedOrder = orderRepository.save(testOrder);
            System.out.println("Test order created with ID: " + savedOrder.getId());
        };
    }
} 