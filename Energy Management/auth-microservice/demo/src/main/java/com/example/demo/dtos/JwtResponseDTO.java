package com.example.demo.dtos;

import java.util.UUID;
import java.util.List;

public class JwtResponseDTO {
    private String token;
    private UUID id;
    private String username;
    private String role;

    public JwtResponseDTO(String token, UUID id, String username, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}