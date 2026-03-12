package com.example.demo.dtos;

import java.io.Serializable;
import java.util.UUID;

public class NotificationDTO implements Serializable {
    private String message;
    private UUID userId;
    private UUID deviceId;
    private Double measurementValue;
    private long timestamp;

    public NotificationDTO() {
    }

    public NotificationDTO(String message, UUID userId, UUID deviceId, Double measurementValue) {
        this.message = message;
        this.userId = userId;
        this.deviceId = deviceId;
        this.measurementValue = measurementValue;
        this.timestamp = System.currentTimeMillis();
    }

    public String getMessage() { return message; }
    public UUID getUserId() { return userId; }
    public UUID getDeviceId() { return deviceId; }
    public Double getMeasurementValue() { return measurementValue; }
    public long getTimestamp() { return timestamp; }

    public void setMessage(String message) { this.message = message; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }
    public void setMeasurementValue(Double measurementValue) { this.measurementValue = measurementValue; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "NotificationDTO{" +
                "message='" + message + '\'' +
                ", userId=" + userId +
                ", deviceId=" + deviceId +
                ", value=" + measurementValue +
                '}';
    }
}