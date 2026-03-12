package com.example.demo.dtos;

import java.util.UUID;

public class MeasurementDTO {
    private UUID id;
    private UUID deviceId;
    private long timestamp;
    private double measurementValue;

    public MeasurementDTO() {
    }

    public MeasurementDTO(UUID id, UUID deviceId, long timestamp, double measurementValue) {
        this.id = id;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getDeviceId() { return deviceId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public double getMeasurementValue() { return measurementValue; }
    public void setMeasurementValue(double measurementValue) { this.measurementValue = measurementValue; }
}