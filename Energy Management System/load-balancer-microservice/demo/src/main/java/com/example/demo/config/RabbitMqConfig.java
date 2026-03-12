package com.example.demo.config;

import org.springframework.amqp.core.Declarables; // Import IMPORTANT
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class RabbitMqConfig {

    public static final String SENSOR_DATA_QUEUE = "sensor-data-queue";
    public static final String MONITORING_QUEUE_PREFIX = "monitoring-queue-";

    @Value("${monitoring.replicas.count:3}")
    private int replicasCount;

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public Queue sensorDataQueue() {
        return new Queue(SENSOR_DATA_QUEUE, true);
    }

    @Bean
    public Declarables replicaQueues() {
        List<Queue> queues = new ArrayList<>();

        for (int i = 1; i <= replicasCount; i++) {
            String queueName = MONITORING_QUEUE_PREFIX + i;
            queues.add(new Queue(queueName, true));
        }

        return new Declarables(queues);
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