package com.example.demo.dtos;

import java.io.Serializable;
import java.util.UUID;

public class MeasurementDTO implements Serializable {

    private UUID deviceId;
    private long timestamp;
    private double measurementValue;

    public MeasurementDTO() {
    }

    public MeasurementDTO(UUID deviceId, long timestamp, double measurementValue) {
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getMeasurementValue() {
        return measurementValue;
    }

    public void setMeasurementValue(double measurementValue) {
        this.measurementValue = measurementValue;
    }

    @Override
    public String toString() {
        return "MeasurementDTO{" +
                "deviceId=" + deviceId +
                ", val=" + measurementValue +
                '}';
    }
}