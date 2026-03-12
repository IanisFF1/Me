package com.example.demo.controllers;

import com.example.demo.dtos.DeviceDTO;
import com.example.demo.dtos.DeviceDetailsDTO;
import com.example.demo.services.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/devices")
@Validated
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        return ResponseEntity.ok(deviceService.findDevices());
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody DeviceDetailsDTO device) {
        UUID id = deviceService.insert(device);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailsDTO> getDevice(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.findDeviceById(id));
    }

    // Controller
    @GetMapping("/find/by-name")
    public ResponseEntity<List<DeviceDetailsDTO>> getDeviceByName(@RequestParam String name) {
        return ResponseEntity.ok(deviceService.findDeviceByName(name));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDetailsDTO> updateDevice(@PathVariable UUID id,
                                                         @Valid @RequestBody DeviceDetailsDTO deviceDetailsDTO) {

        DeviceDetailsDTO updatedDevice = deviceService.update(id, deviceDetailsDTO);
        return ResponseEntity.ok(updatedDevice);
    }


    @PatchMapping("/{deviceId}/assign/{userId}")
    public ResponseEntity<Void> assignUser(@PathVariable UUID deviceId, @PathVariable UUID userId) {
        deviceService.assignDeviceToUser(deviceId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        deviceService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{deviceId}/unassign")
    public ResponseEntity<Void> unassignUser(@PathVariable UUID deviceId) {
        deviceService.unassignDevice(deviceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(deviceService.findAllByUserId(userId));
    }

}
