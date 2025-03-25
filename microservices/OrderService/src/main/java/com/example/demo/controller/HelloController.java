package com.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Hello Controller", description = "Simple hello world endpoints")
public class HelloController {
    
    @GetMapping("/hello")
    @Operation(summary = "Get hello message", description = "Returns a simple hello message")
    public String hello() {
        return "Hello, Spring Boot!";
    }
} 