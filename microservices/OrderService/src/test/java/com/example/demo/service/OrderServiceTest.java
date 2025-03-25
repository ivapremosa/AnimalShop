package com.example.demo.service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private OrderRequest orderRequest;
    private Order order;

    @BeforeEach
    void setUp() {
        orderRequest = new OrderRequest();
        orderRequest.setCustomerName("John Doe");
        orderRequest.setCustomerEmail("john@example.com");
        orderRequest.setShippingAddress("123 Main St");
        orderRequest.setTotalAmount(new BigDecimal("99.99"));

        order = new Order();
        order.setId("1");
        order.setCustomerName("John Doe");
        order.setCustomerEmail("john@example.com");
        order.setShippingAddress("123 Main St");
        order.setTotalAmount(new BigDecimal("99.99"));
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setLastUpdated(LocalDateTime.now());
    }

    @Test
    void shouldCreateOrder() {
        // Given
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        Order createdOrder = orderService.createOrder(orderRequest);

        // Then
        assertThat(createdOrder).isNotNull();
        assertThat(createdOrder.getCustomerName()).isEqualTo(orderRequest.getCustomerName());
        assertThat(createdOrder.getCustomerEmail()).isEqualTo(orderRequest.getCustomerEmail());
        assertThat(createdOrder.getTotalAmount()).isEqualTo(orderRequest.getTotalAmount());
        assertThat(createdOrder.getStatus()).isEqualTo("PENDING");
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void shouldGetAllOrders() {
        // Given
        List<Order> orders = Arrays.asList(order);
        when(orderRepository.findAll()).thenReturn(orders);

        // When
        List<Order> retrievedOrders = orderService.getAllOrders();

        // Then
        assertThat(retrievedOrders).hasSize(1);
        assertThat(retrievedOrders.get(0).getCustomerName()).isEqualTo("John Doe");
        verify(orderRepository).findAll();
    }

    @Test
    void shouldGetOrderById() {
        // Given
        when(orderRepository.findById("1")).thenReturn(Optional.of(order));

        // When
        Order retrievedOrder = orderService.getOrderById("1");

        // Then
        assertThat(retrievedOrder).isNotNull();
        assertThat(retrievedOrder.getCustomerName()).isEqualTo("John Doe");
        verify(orderRepository).findById("1");
    }

    @Test
    void shouldThrowExceptionWhenOrderNotFound() {
        // Given
        when(orderRepository.findById("1")).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> orderService.getOrderById("1"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Order not found with id: 1");
    }

    @Test
    void shouldUpdateOrder() {
        // Given
        when(orderRepository.findById("1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        Order updatedOrder = orderService.updateOrder("1", orderRequest);

        // Then
        assertThat(updatedOrder).isNotNull();
        assertThat(updatedOrder.getCustomerName()).isEqualTo(orderRequest.getCustomerName());
        verify(orderRepository).findById("1");
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void shouldUpdateOrderStatus() {
        // Given
        when(orderRepository.findById("1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        Order updatedOrder = orderService.updateOrderStatus("1", "PROCESSING");

        // Then
        assertThat(updatedOrder).isNotNull();
        assertThat(updatedOrder.getStatus()).isEqualTo("PROCESSING");
        verify(orderRepository).findById("1");
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void shouldDeleteOrder() {
        // Given
        when(orderRepository.existsById("1")).thenReturn(true);
        doNothing().when(orderRepository).deleteById("1");

        // When
        orderService.deleteOrder("1");

        // Then
        verify(orderRepository).existsById("1");
        verify(orderRepository).deleteById("1");
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentOrder() {
        // Given
        when(orderRepository.existsById("1")).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> orderService.deleteOrder("1"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Order not found with id: 1");
        verify(orderRepository).existsById("1");
        verify(orderRepository, never()).deleteById(any());
    }
} 