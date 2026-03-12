package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.NotificationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationConsumer.class);

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = RabbitMqConfig.NOTIFICATION_QUEUE)
    public void receiveNotification(NotificationDTO notification) {
        LOGGER.info("Am primit alerta din RabbitMQ: {}", notification);

        String destination = "/topic/alerts/" + notification.getUserId();

        messagingTemplate.convertAndSend(destination, notification);

        LOGGER.info("Am trimis notificarea prin WebSocket la: {}", destination);
    }
}