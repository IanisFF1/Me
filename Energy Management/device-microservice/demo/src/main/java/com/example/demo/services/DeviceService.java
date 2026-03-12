package com.example.demo.services;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.DeviceDTO;
import com.example.demo.dtos.DeviceDetailsDTO;
import com.example.demo.dtos.SyncMessage;
import com.example.demo.dtos.builders.DeviceBuilder;
import com.example.demo.entities.*;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;
    private final UserRefRepository userRefRepository; // Injectat prin constructor e mai safe
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, UserRefRepository userRefRepository, RabbitTemplate rabbitTemplate) {
        this.deviceRepository = deviceRepository;
        this.userRefRepository = userRefRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDTO findDeviceById(UUID id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());
    }

    public List<DeviceDetailsDTO> findDeviceByName(String name) {
        List<Device> devices = deviceRepository.findByName(name);
        if (devices.isEmpty()) {
            LOGGER.error("Devices with name {} were not found in db", name);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with name: " + name);
        }
        return devices.stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    public UUID insert(DeviceDetailsDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Device inserted with id {}", device.getId());

        // Trimitem mesaj CREATE
        sendSyncMessage(device.getId(), "CREATE", device);

        return device.getId();
    }

    public DeviceDetailsDTO update(UUID id, DeviceDetailsDTO deviceDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (!deviceOptional.isPresent()) {
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        Device device = deviceOptional.get();
        device.setName(deviceDTO.getName());
        device.setMaxConsumption(deviceDTO.getMaxConsumption());

        Device updatedDevice = deviceRepository.save(device);

        sendSyncMessage(updatedDevice.getId(), "UPDATE", updatedDevice);

        return DeviceBuilder.toDeviceDetailsDTO(updatedDevice);
    }


    public void delete(UUID id) {
        // 1. Verifică dacă există pentru a evita erori inutile
        Optional<Device> device = deviceRepository.findById(id);
        if (!device.isPresent()) {
            throw new ResourceNotFoundException("Device not found: " + id);
        }

        deviceRepository.deleteById(id);

        try {
            SyncMessage message = new SyncMessage(id, "DELETE", "DEVICE", null);
            rabbitTemplate.convertAndSend(RabbitMqConfig.DEVICE_MONITORING_QUEUE, message);
            LOGGER.info("Mesaj DELETE trimis catre Monitoring pentru device: {}", id);
        } catch (Exception e) {
            LOGGER.error("Eroare RabbitMQ Delete: {}", e.getMessage());
        }
    }

    public void assignDeviceToUser(UUID deviceId, UUID userId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} not found", deviceId);
            throw new ResourceNotFoundException("Device not found: " + deviceId);
        }

        Optional<UserRef> userOptional = userRefRepository.findById(userId);
        if (!userOptional.isPresent()) {
            LOGGER.error("User with id {} not found in local db", userId);
            throw new ResourceNotFoundException("User not found: " + userId);
        }

        Device device = deviceOptional.get();
        device.setUserId(userId);
        Device savedDevice = deviceRepository.save(device);

        LOGGER.info("Device {} assigned to user {}", deviceId, userId);

        sendSyncMessage(savedDevice.getId(), "UPDATE", savedDevice);
    }

    public void unassignDevice(UUID deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        device.setUserId(null);
        Device savedDevice = deviceRepository.save(device);

        LOGGER.info("Device {} unassigned successfully", deviceId);

        // --- AICI ERA LIPSA: Trimitem update catre Monitoring ---
        sendSyncMessage(savedDevice.getId(), "UPDATE", savedDevice);
    }

    public List<DeviceDTO> findAllByUserId(UUID userId) {
        return deviceRepository.findByUserId(userId)
                .stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    private void sendSyncMessage(UUID id, String action, Device device) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("maxConsumption", device.getMaxConsumption());

            details.put("userId", device.getUserId() != null ? device.getUserId().toString() : null);

            details.put("name", device.getName());

            SyncMessage message = new SyncMessage(id, action, "DEVICE", details);
            rabbitTemplate.convertAndSend(RabbitMqConfig.DEVICE_MONITORING_QUEUE, message);

            LOGGER.info("Mesaj trimis catre Monitoring: {} DEVICE {}, UserID: {}", action, id, device.getUserId());
        } catch (Exception e) {
            LOGGER.error("Eroare trimitere mesaj RabbitMQ: {}", e.getMessage());
        }
    }
}