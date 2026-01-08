package com.example.demo.dtos;

import java.util.UUID;

public class UserSyncDTO {
    private UUID id;
    private String name;

    public UserSyncDTO(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters si Setters (sau @Data daca ai Lombok)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}