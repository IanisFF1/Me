package com.example.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMqConfig.class);

    public static final String NOTIFICATION_QUEUE = "notification-queue";
    public static final String DEVICE_MONITORING_QUEUE = "device-monitoring-queue";
    public static final String MEASUREMENTS_QUEUE = "measurements-queue";

    public static final String MONITORING_QUEUE_PREFIX = "monitoring-queue-";

    @Value("${INSTANCE_ID:1}")
    private String instanceId;

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public Queue assignedQueue() {
        String dynamicQueueName = MONITORING_QUEUE_PREFIX + instanceId;

        LOGGER.info(">>> ACEASTA REPLICA (ID={}) VA ASCULTA COADA: {}", instanceId, dynamicQueueName);

        return new Queue(dynamicQueueName, true);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Queue deviceMonitoringQueue() {
        return new Queue(DEVICE_MONITORING_QUEUE, true);
    }

    @Bean
    public Queue measurementsQueue() {
        return new Queue(MEASUREMENTS_QUEUE, true);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}