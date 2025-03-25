package com.example.demo.controller;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs for managing orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        logger.info("Received request to create new order for customer: {}", request.getCustomerName());
        try {
            Order order = orderService.createOrder(request);
            if (order == null) {
                logger.error("Failed to create order: service returned null");
                return ResponseEntity.badRequest()
                    .body(Map.of("errors", List.of("Failed to create order: Invalid request data")));
            }
            logger.info("Order created successfully with ID: {}", order.getId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Error creating order", e);
            return ResponseEntity.badRequest()
                .body(Map.of("errors", List.of("Failed to create order: " + e.getMessage())));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        logger.error("Validation errors: {}", errors);
        return ResponseEntity.badRequest().body(Map.of("errors", errors));
    }

    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        logger.debug("Received request to get all orders");
        List<Order> orders = orderService.getAllOrders();
        logger.debug("Retrieved {} orders", orders.size());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        logger.debug("Received request to get order with ID: {}", id);
        Order order = orderService.getOrderById(id);
        logger.debug("Retrieved order: {}", order);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update order")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @Valid @RequestBody OrderRequest request) {
        logger.info("Received request to update order with ID: {}", id);
        Order order = orderService.updateOrder(id, request);
        logger.info("Order updated successfully: {}", order);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        logger.info("Received request to update status of order {} to: {}", id, status);
        Order order = orderService.updateOrderStatus(id, status);
        logger.info("Order status updated successfully: {}", order);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        logger.info("Received request to delete order with ID: {}", id);
        orderService.deleteOrder(id);
        logger.info("Order deleted successfully");
        return ResponseEntity.noContent().build();
    }
} 