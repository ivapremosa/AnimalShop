package com.example.demo.service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        logger.info("Creating new order for customer: {}", request.getCustomerName());
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setLastUpdated(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        logger.debug("Fetching all orders");
        return orderRepository.findAll();
    }
    
    public Order getOrderById(String id) {
        logger.debug("Fetching order with ID: {}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    @Transactional
    public Order updateOrder(String id, OrderRequest request) {
        logger.info("Updating order with ID: {}", id);
        Order order = getOrderById(id);
        
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setTotalAmount(request.getTotalAmount());
        order.setLastUpdated(LocalDateTime.now());
        
        return orderRepository.save(order);
    }
    
    @Transactional
    public Order updateOrderStatus(String id, String status) {
        logger.info("Updating status of order {} to: {}", id, status);
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setLastUpdated(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    @Transactional
    public void deleteOrder(String id) {
        logger.info("Deleting order with ID: {}", id);
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
} 