package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.MeasurementDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LoadBalancerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoadBalancerService.class);

    private final RabbitTemplate rabbitTemplate;

    @Value("${monitoring.replicas.count:3}")
    private int replicasCount;

    public LoadBalancerService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RabbitMqConfig.SENSOR_DATA_QUEUE)
    public void distributeLoad(MeasurementDTO measurement) {

        if (measurement.getDeviceId() == null) {
            LOGGER.warn("Mesaj ignorat: DeviceID este null -> {}", measurement);
            return;
        }

        int hash = Math.abs(measurement.getDeviceId().hashCode());

        int replicaIndex = (hash % replicasCount) + 1;

        String targetQueue = RabbitMqConfig.MONITORING_QUEUE_PREFIX + replicaIndex;

        LOGGER.info("Rutare: Device {} -> Replica {} ({})",
                measurement.getDeviceId(), replicaIndex, targetQueue);

        rabbitTemplate.convertAndSend(targetQueue, measurement);
    }
}