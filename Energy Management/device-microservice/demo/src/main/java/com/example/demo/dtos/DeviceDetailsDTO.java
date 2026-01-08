package com.example.demo.dtos;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


import java.util.Objects;
import java.util.UUID;

public class DeviceDetailsDTO {

    private UUID id;

    @NotBlank(message = "name is required")
    private String name;
    @NotNull(message = "maxConsumption is required")
    private int maxConsumption;
    private UUID userId;

    public DeviceDetailsDTO() {
    }

    public DeviceDetailsDTO(String name, int maxConsumption, UUID userId) {
        this.name = name;
        this.maxConsumption = maxConsumption;
        this.userId = userId;
    }

    public DeviceDetailsDTO(UUID id, String name, int maxConsumption, UUID userId) {
        this.id = id;
        this.name = name;
        this.maxConsumption = maxConsumption;
        this.userId = userId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMaxConsumption() { return maxConsumption; }
    public void setMaxConsumption(int maxConsumption) { this.maxConsumption = maxConsumption; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDetailsDTO that = (DeviceDetailsDTO) o;
        return userId == that.userId &&
                Objects.equals(name, that.name) &&
                Objects.equals(maxConsumption, that.maxConsumption);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, maxConsumption, userId);
    }
}
