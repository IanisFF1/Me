package com.example.demo.services;


import com.example.demo.dtos.DeviceDTO;
import com.example.demo.dtos.DeviceDetailsDTO;
import com.example.demo.dtos.builders.DeviceBuilder;
import com.example.demo.entities.*;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
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

    // 1. Schimbă tipul returnat în List<DeviceDetailsDTO>
    public List<DeviceDetailsDTO> findDeviceByName(String name) {

        List<Device> devices = deviceRepository.findByName(name);

        if (devices.isEmpty()) {
            LOGGER.error("Devices with name {} were not found in db", name);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with name: " + name);
        }

        // 2. Transformă lista de Device în listă de DeviceDetailsDTO
        return devices.stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    public UUID insert(DeviceDetailsDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        return device.getId();
    }

    public DeviceDetailsDTO update(UUID id, DeviceDetailsDTO deviceDetailsDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if(!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }

        Device deviceToUpdate = deviceOptional.get();

        deviceToUpdate.setName(deviceDetailsDTO.getName());
        deviceToUpdate.setMaxConsumption(deviceDetailsDTO.getMaxConsumption());
        deviceToUpdate.setUserId(deviceDetailsDTO.getUserId());

        Device updatedDevice = deviceRepository.save(deviceToUpdate);

        LOGGER.debug("Device with id {} was updated in db", updatedDevice.getId());

        // 5. Returneaza DTO-ul actualizat
        return DeviceBuilder.toDeviceDetailsDTO(updatedDevice);
    }

    public UUID delete(UUID id) {

        // 1. Verifica daca entitatea exista inainte de a o sterge
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }

        deviceRepository.deleteById(id);

        LOGGER.debug("Device with id {} was deleted from db", id);

        return id;
    }

    @Autowired
    private UserRefRepository userRefRepository;

    public void assignDeviceToUser(UUID deviceId, UUID userId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} not found", deviceId);
            throw new ResourceNotFoundException("Device not found: " + deviceId);
        }

        // 2. Verifică dacă User-ul există în baza ta locală (sincronizată)
        // Este important, ca să nu aloci device-ul unui ID fantomă!
        Optional<UserRef> userOptional = userRefRepository.findById(userId);
        if (!userOptional.isPresent()) {
            LOGGER.error("User with id {} not found in local db", userId);
            throw new ResourceNotFoundException("User not found: " + userId);
        }

        // 3. Fă atribuirea și salvează
        Device device = deviceOptional.get();
        device.setUserId(userId);
        deviceRepository.save(device); // Hibernate face update automat

        LOGGER.info("Device {} assigned to user {}", deviceId, userId);
    }

    // In DeviceService.java

    public void unassignDevice(UUID deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        device.setUserId(null);
        deviceRepository.save(device);

        LOGGER.info("Device {} unassigned successfully", deviceId);
    }


    public List<DeviceDTO> findAllByUserId(UUID userId) {
        return deviceRepository.findByUserId(userId)
                .stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

}

