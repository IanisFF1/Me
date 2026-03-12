package com.example.demo.controllers;

import com.example.demo.dtos.MeasurementDTO;
import com.example.demo.services.MeasurementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/monitoring")
@CrossOrigin
public class MeasurementController {

    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<List<MeasurementDTO>> getMeasurements(@PathVariable UUID deviceId) {
        System.out.println("--- DEBUG REQUEST ---");
        System.out.println("Frontend cere date pentru Device ID: " + deviceId);

        List<MeasurementDTO> list = measurementService.getMeasurementsByDeviceId(deviceId);

        System.out.println("Baza de date a gasit: " + list.size() + " inregistrari.");
        System.out.println("---------------------");

        return ResponseEntity.ok(list);
    }
}