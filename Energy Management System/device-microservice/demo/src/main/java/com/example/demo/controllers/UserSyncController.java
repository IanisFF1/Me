package com.example.demo.controllers;

import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.entities.UserRef;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/devices/sync/users")
public class UserSyncController {

    private final UserRefRepository userRefRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public UserSyncController(UserRefRepository userRefRepository, DeviceRepository deviceRepository) {
        this.userRefRepository = userRefRepository;
        this.deviceRepository = deviceRepository;
    }

    @PostMapping
    public void syncUser(@RequestBody UserSyncDTO userDto) {
        UserRef userRef = new UserRef(userDto.getId(), userDto.getName());
        userRefRepository.save(userRef);
        System.out.println("User sincronizat cu succes: " + userDto.getName());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteUser(@PathVariable UUID id) {
        deviceRepository.detachDevicesFromUser(id);
        System.out.println("Device-urile au fost dezlegate de userul: " + id);

        userRefRepository.deleteById(id);
        System.out.println("User sters din Device DB: " + id);
    }
    @GetMapping
    public List<UserRef> getAllSyncedUsers() {
        return userRefRepository.findAll();
    }
}