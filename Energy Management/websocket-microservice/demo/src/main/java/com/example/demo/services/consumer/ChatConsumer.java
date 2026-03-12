package com.example.demo.services.consumer;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.MessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatConsumer.class);
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = RabbitMqConfig.CHAT_QUEUE)
    public void consumeChatMessage(MessageDTO message) {
        LOGGER.info("WebSocket Service a primit mesaj chat: {}", message);

        String destination = "/topic/chat/" + message.getReceiverId();

        messagingTemplate.convertAndSend(destination, message);
        LOGGER.info("Mesaj trimis prin WebSocket la: {}", destination);

    }
}