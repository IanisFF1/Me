package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.SyncMessage;
import com.example.demo.entities.UserRef;
import com.example.demo.repositories.DeviceRepository;
import com.example.demo.repositories.UserRefRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserEventsListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserEventsListener.class);

    private final UserRefRepository userRefRepository;
    private final DeviceRepository deviceRepository;

    public UserEventsListener(UserRefRepository userRefRepository, DeviceRepository deviceRepository) {
        this.userRefRepository = userRefRepository;
        this.deviceRepository = deviceRepository;
    }

    @RabbitListener(queues = RabbitMqConfig.USER_DEVICE_QUEUE)
    @Transactional
    public void consumeMessage(SyncMessage message) {
        LOGGER.info("Mesaj primit din RabbitMQ: {} pe entitatea {}", message.getAction(), message.getEntityType());

        if (!"USER".equals(message.getEntityType())) {
            return;
        }

        switch (message.getAction()) {
            case "CREATE":
            case "UPDATE":
                handleSaveUser(message);
                break;
            case "DELETE":
                handleDeleteUser(message.getId());
                break;
            default:
                LOGGER.warn("Actiune necunoscuta: {}", message.getAction());
        }
    }

    private void handleSaveUser(SyncMessage message) {
        try {
            UUID id = message.getId();
            String name = (String) message.getDetails().get("name");

            if (name == null) {
                LOGGER.error("Numele lipseste din mesajul de sincronizare!");
                return;
            }

            UserRef userRef = new UserRef(id, name);
            userRefRepository.save(userRef);
            LOGGER.info("User sincronizat/actualizat local: {}", id);

        } catch (Exception e) {
            LOGGER.error("Eroare la procesarea mesajului de save user: {}", e.getMessage());
        }
    }

    private void handleDeleteUser(UUID userId) {
        try {
            deviceRepository.detachDevicesFromUser(userId);
            LOGGER.info("Device-urile au fost dezlegate de userul: {}", userId);

            userRefRepository.deleteById(userId);
            LOGGER.info("User sters din baza locala: {}", userId);

        } catch (Exception e) {
            LOGGER.error("Eroare la stergerea userului local: {}", e.getMessage());
        }
    }
}