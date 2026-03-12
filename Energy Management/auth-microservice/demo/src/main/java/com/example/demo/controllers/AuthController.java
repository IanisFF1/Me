package com.example.demo.controllers;

import com.example.demo.dtos.JwtResponseDTO;
import com.example.demo.dtos.LoginRequestDTO;
import com.example.demo.dtos.RegisterRequestDTO;
import com.example.demo.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        try {
            authService.register(registerRequest);

            return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully!"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            JwtResponseDTO response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {

            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Username or password incorrect!"));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}