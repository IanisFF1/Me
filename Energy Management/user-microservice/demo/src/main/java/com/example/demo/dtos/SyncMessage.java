package com.example.demo.dtos;

import java.io.Serializable;
import java.util.Map;
import java.util.UUID;

public class SyncMessage implements Serializable {
    private UUID id;
    private String action;
    private String entityType;
    private Map<String, Object> details;

    public SyncMessage() {
    }

    public SyncMessage(UUID id, String action, String entityType, Map<String, Object> details) {
        this.id = id;
        this.action = action;
        this.entityType = entityType;
        this.details = details;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}