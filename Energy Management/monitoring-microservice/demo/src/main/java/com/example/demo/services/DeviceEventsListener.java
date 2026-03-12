package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.SyncMessage;
import com.example.demo.entities.MonitoredDevice;
import com.example.demo.repositories.MonitoredDeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeviceEventsListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceEventsListener.class);
    private final MonitoredDeviceRepository deviceRepository;

    public DeviceEventsListener(MonitoredDeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @RabbitListener(queues = RabbitMqConfig.DEVICE_MONITORING_QUEUE)
    public void consumeSyncMessage(SyncMessage message) {
        if (!"DEVICE".equals(message.getEntityType())) {
            return;
        }

        LOGGER.info("Monitoring a primit update pentru device: {} actiune: {}", message.getId(), message.getAction());

        if ("DELETE".equals(message.getAction())) {
            deviceRepository.deleteById(message.getId());
            LOGGER.info("Device sters din Monitoring: {}", message.getId());
        } else {
            try {
                double maxConsumption = 0.0;
                Object maxVal = message.getDetails().get("maxConsumption");
                if (maxVal instanceof Integer) {
                    maxConsumption = ((Integer) maxVal).doubleValue();
                } else if (maxVal instanceof Double) {
                    maxConsumption = (Double) maxVal;
                }

                UUID userId = null;
                Object userIdObj = message.getDetails().get("userId");

                if (userIdObj != null) {
                    try {
                        userId = UUID.fromString(userIdObj.toString());
                    } catch (IllegalArgumentException e) {
                        LOGGER.error("UUID invalid primit: {}", userIdObj);
                    }
                }

                String deviceName = (String) message.getDetails().get("name");

                MonitoredDevice device = new MonitoredDevice(message.getId(), maxConsumption, userId, deviceName);
                deviceRepository.save(device);

                LOGGER.info("Device sincronizat cu succes. UserID curent: {}", userId);

            } catch (Exception e) {
                LOGGER.error("Eroare la salvarea device-ului monitorizat: {}", e.getMessage());
                e.printStackTrace();
            }
        }
    }
}