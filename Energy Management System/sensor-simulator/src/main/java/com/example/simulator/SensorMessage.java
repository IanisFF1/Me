package com.example.simulator;

import java.io.Serializable;
import java.util.UUID;

public class SensorMessage implements Serializable {
    private long timestamp;
    private UUID deviceId;
    private double measurementValue;
    public SensorMessage() {
    }

    public SensorMessage(long timestamp, UUID deviceId, double measurementValue) {
        this.timestamp = timestamp;
        this.deviceId = deviceId;
        this.measurementValue = measurementValue;
    }

    public long getTimestamp() { return timestamp; }
    public UUID getDeviceId() { return deviceId; }
    public double getMeasurementValue() { return measurementValue; }
}