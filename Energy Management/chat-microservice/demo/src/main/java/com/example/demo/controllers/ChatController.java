package com.example.demo.controllers;

import com.example.demo.dtos.ChatRuleDTO; // <--- Import nou
import com.example.demo.dtos.MessageDTO;
import com.example.demo.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/rule")
    public ResponseEntity<ChatRuleDTO> addRule(@RequestBody ChatRuleDTO ruleDTO) {
        ChatRuleDTO savedRule = chatService.addRule(ruleDTO);
        return new ResponseEntity<>(savedRule, HttpStatus.CREATED);
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO messageDTO) {
        MessageDTO sentMessage = chatService.sendMessage(messageDTO);
        return new ResponseEntity<>(sentMessage, HttpStatus.CREATED);
    }

    @GetMapping("/history/{user1}/{user2}")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable UUID user1, @PathVariable UUID user2) {
        List<MessageDTO> history = chatService.getConversation(user1, user2);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return new ResponseEntity<>("Chat Service is running!", HttpStatus.OK);
    }
}