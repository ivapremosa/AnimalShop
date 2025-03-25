package com.example.demo.controller;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void shouldCreateOrder() throws Exception {
        when(orderService.createOrder(any(OrderRequest.class))).thenReturn(order);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.customerName").value("John Doe"))
                .andExpect(jsonPath("$.totalAmount").value("99.99"));
    }

    @Test
    void shouldGetAllOrders() throws Exception {
        List<Order> orders = Arrays.asList(order);
        when(orderService.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].customerName").value("John Doe"));
    }

    @Test
    void shouldGetOrderById() throws Exception {
        when(orderService.getOrderById("1")).thenReturn(order);

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.customerName").value("John Doe"));
    }

    @Test
    void shouldUpdateOrder() throws Exception {
        when(orderService.updateOrder(eq("1"), any(OrderRequest.class))).thenReturn(order);

        mockMvc.perform(put("/api/orders/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.customerName").value("John Doe"));
    }

    @Test
    void shouldUpdateOrderStatus() throws Exception {
        when(orderService.updateOrderStatus("1", "PROCESSING")).thenReturn(order);

        mockMvc.perform(patch("/api/orders/1/status")
                .param("status", "PROCESSING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldDeleteOrder() throws Exception {
        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());
        
        verify(orderService).deleteOrder("1");
    }
} 