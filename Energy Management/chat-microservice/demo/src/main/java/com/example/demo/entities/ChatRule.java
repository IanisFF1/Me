package com.example.demo.entities;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "chat_rules")
public class ChatRule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String question;

    @Column(nullable = false, length = 1000)
    private String response;

    public ChatRule() {
    }

    public ChatRule(String question, String response) {
        this.question = question;
        this.response = response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}