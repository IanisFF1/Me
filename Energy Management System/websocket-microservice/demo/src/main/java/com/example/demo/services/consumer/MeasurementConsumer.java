package com.example.demo.services.consumer;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.SensorMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MeasurementConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MeasurementConsumer.class);
    private final SimpMessagingTemplate messagingTemplate;

    public MeasurementConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = RabbitMqConfig.MEASUREMENTS_QUEUE)
    public void consumeLiveMeasurement(SensorMessage message) {
        LOGGER.debug("Live data received: {}", message);

        String destination = "/topic/device/" + message.getDeviceId();

        messagingTemplate.convertAndSend(destination, message);
    }
}