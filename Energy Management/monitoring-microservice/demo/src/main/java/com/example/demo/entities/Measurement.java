package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

@Entity
@Table(name = "measurements")
public class Measurement {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "device_id", nullable = false)
    private UUID deviceId;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;

    @Column(name = "measurement_value", nullable = false)
    private double measurementValue;

    public Measurement() {
    }

    public Measurement(UUID deviceId, long timestamp, double measurementValue) {
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    // Getters/Setters standard
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getDeviceId() { return deviceId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public double getMeasurementValue() { return measurementValue; }
    public void setMeasurementValue(double measurementValue) { this.measurementValue = measurementValue; }
}