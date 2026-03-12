package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;


import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @UuidGenerator
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "maxConsumption", nullable = false)
    private int maxConsumption;

    @Column(name = "userId", nullable = true)
    private UUID userId;


    public Device() {
    }

    public Device(String name, int maxConsumption, UUID userId) {
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
}
