package com.example.demo.dtos;

import java.util.UUID;

public class ChatRuleDTO {
    private UUID id;
    private String question;
    private String response;

    public ChatRuleDTO() {
    }

    public ChatRuleDTO(UUID id, String question, String response) {
        this.id = id;
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