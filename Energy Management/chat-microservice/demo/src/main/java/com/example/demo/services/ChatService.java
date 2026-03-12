package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.MessageDTO;
import com.example.demo.dtos.ChatRuleDTO;
import com.example.demo.entities.ChatMessage;
import com.example.demo.entities.ChatRule;
import com.example.demo.repositories.ChatMessageRepository;
import com.example.demo.repositories.ChatRuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatService.class);

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRuleRepository chatRuleRepository;
    private final RabbitTemplate rabbitTemplate;
    private final GeminiService geminiService;
    @Autowired
    public ChatService(ChatMessageRepository chatMessageRepository,
                       ChatRuleRepository chatRuleRepository,
                       RabbitTemplate rabbitTemplate,
                       GeminiService geminiService) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRuleRepository = chatRuleRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.geminiService = geminiService;
    }

    public ChatRuleDTO addRule(ChatRuleDTO ruleDTO) {
        ChatRule rule = new ChatRule(ruleDTO.getQuestion(), ruleDTO.getResponse());
        ChatRule savedRule = chatRuleRepository.save(rule);

        return new ChatRuleDTO(savedRule.getId(), savedRule.getQuestion(), savedRule.getResponse());
    }

    public MessageDTO sendMessage(MessageDTO messageDTO) {
        ChatMessage chatMessage = new ChatMessage(
                messageDTO.getSenderId(),
                messageDTO.getReceiverId(),
                messageDTO.getMessage()
        );
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        messageDTO.setId(savedMessage.getId());
        messageDTO.setTimestamp(savedMessage.getTimestamp());

        sendToWebSocket(messageDTO);
        checkAndSendAutoResponse(savedMessage);

        return messageDTO;
    }

    public List<MessageDTO> getConversation(UUID user1, UUID user2) {
        List<ChatMessage> messages = chatMessageRepository.findConversation(user1, user2);

        return messages.stream().map(msg -> new MessageDTO(
                msg.getId(),
                msg.getSenderId(),
                msg.getReceiverId(),
                msg.getMessage(),
                msg.getTimestamp(),
                msg.isRead()
        )).collect(Collectors.toList());
    }


    private void checkAndSendAutoResponse(ChatMessage originalMessage) {
        List<ChatRule> allRules = chatRuleRepository.findAll();
        String userMessage = originalMessage.getMessage().toLowerCase();

        Optional<ChatRule> matchingRule = allRules.stream()
                .filter(rule -> userMessage.contains(rule.getQuestion().toLowerCase()))
                .findFirst();

        String responseText;

        if (matchingRule.isPresent()) {
            ChatRule rule = matchingRule.get();
            LOGGER.info("Regula gasita ('{}'), trimitem raspuns din baza de date.", rule.getQuestion());
            responseText = rule.getResponse();
        } else {
            LOGGER.info("Nicio regula gasita. Apelam Gemini AI...");
            responseText = geminiService.getAnswer(originalMessage.getMessage());
        }

        sendAutoResponse(originalMessage, responseText);
    }

    private void sendAutoResponse(ChatMessage originalMessage, String text) {

        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        ChatMessage autoResponse = new ChatMessage(
                originalMessage.getReceiverId(),
                originalMessage.getSenderId(),
                text
        );

        ChatMessage savedResponse = chatMessageRepository.save(autoResponse);

        MessageDTO responseDTO = new MessageDTO(
                savedResponse.getId(),
                savedResponse.getSenderId(),
                savedResponse.getReceiverId(),
                savedResponse.getMessage(),
                savedResponse.getTimestamp(),
                savedResponse.isRead()
        );

        sendToWebSocket(responseDTO);
    }

    private void sendToWebSocket(MessageDTO message) {
        try {
            LOGGER.info("Trimitere mesaj catre WebSocket Queue: {}", message);
            rabbitTemplate.convertAndSend(RabbitMqConfig.CHAT_QUEUE, message);
        } catch (Exception e) {
            LOGGER.error("Eroare la trimiterea mesajului in RabbitMQ: {}", e.getMessage());
        }
    }
}