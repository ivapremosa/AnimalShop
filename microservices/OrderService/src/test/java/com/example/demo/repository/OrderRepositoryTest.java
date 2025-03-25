package com.example.demo.repository;

import com.example.demo.model.Order;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    void shouldSaveAndRetrieveOrder() {
        // Given
        Order order = new Order();
        order.setCustomerName("John Doe");
        order.setCustomerEmail("john@example.com");
        order.setShippingAddress("123 Main St");
        order.setTotalAmount(new BigDecimal("99.99"));
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setLastUpdated(LocalDateTime.now());

        // When
        Order savedOrder = orderRepository.save(order);
        Optional<Order> retrievedOrder = orderRepository.findById(savedOrder.getId());

        // Then
        assertThat(retrievedOrder).isPresent();
        assertThat(retrievedOrder.get().getCustomerName()).isEqualTo("John Doe");
        assertThat(retrievedOrder.get().getCustomerEmail()).isEqualTo("john@example.com");
        assertThat(retrievedOrder.get().getTotalAmount()).isEqualTo(new BigDecimal("99.99"));
    }

    @Test
    void shouldFindAllOrders() {
        // Given
        Order order1 = new Order();
        order1.setCustomerName("John Doe");
        order1.setCustomerEmail("john@example.com");
        order1.setTotalAmount(new BigDecimal("99.99"));
        order1.setStatus("PENDING");
        order1.setOrderDate(LocalDateTime.now());
        order1.setLastUpdated(LocalDateTime.now());

        Order order2 = new Order();
        order2.setCustomerName("Jane Doe");
        order2.setCustomerEmail("jane@example.com");
        order2.setTotalAmount(new BigDecimal("149.99"));
        order2.setStatus("PENDING");
        order2.setOrderDate(LocalDateTime.now());
        order2.setLastUpdated(LocalDateTime.now());

        orderRepository.save(order1);
        orderRepository.save(order2);

        // When
        var orders = orderRepository.findAll();

        // Then
        assertThat(orders).hasSize(2);
        assertThat(orders).extracting(Order::getCustomerName)
                .containsExactlyInAnyOrder("John Doe", "Jane Doe");
    }
} 