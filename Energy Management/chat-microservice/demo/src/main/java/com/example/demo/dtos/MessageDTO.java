package com.example.demo.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageDTO {
    private UUID id;
    private UUID senderId;
    private UUID receiverId;
    private String message;
    private LocalDateTime timestamp;
    private Boolean isRead = false;

    public MessageDTO() {
    }

    public MessageDTO(UUID id, UUID senderId, UUID receiverId, String message, LocalDateTime timestamp, Boolean isRead) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.timestamp = timestamp;
        this.isRead = isRead != null ? isRead : false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }

    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Getter-ul si Setter-ul pentru Boolean
    public Boolean getIsRead() { return isRead; }

    public void setIsRead(Boolean isRead) {
        this.isRead = (isRead != null) ? isRead : false;
    }

    @Override
    public String toString() {
        return "MessageDTO{sender=" + senderId + ", receiver=" + receiverId + ", msg='" + message + "'}";
    }
}