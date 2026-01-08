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

// Permite accesul din orice sursa (util pentru Frontend React/Angular)
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

            // Returnam JSON: { "message": "User registered successfully!" }
            return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully!"));

        } catch (RuntimeException e) {
            // Returnam JSON: { "error": "Error: Username is already taken!" }
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            JwtResponseDTO response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Daca parola e gresita sau userul nu exista, returnam 401 Unauthorized (nu 500!)
            // Returnam JSON ca sa nu crape frontend-ul
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Username or password incorrect!"));
        }
    }

    // In AuthController.java

    @DeleteMapping("/users/{id}") // Endpoint: DELETE /auth/users/{id}
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


}