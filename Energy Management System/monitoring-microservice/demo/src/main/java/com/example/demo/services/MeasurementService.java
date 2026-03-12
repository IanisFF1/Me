package com.example.demo.services;

import com.example.demo.dtos.MeasurementDTO;
import com.example.demo.dtos.builders.MeasurementBuilder;
import com.example.demo.entities.Measurement;
import com.example.demo.repositories.MeasurementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MeasurementService {

    private final MeasurementRepository measurementRepository;

    public MeasurementService(MeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    public List<MeasurementDTO> getMeasurementsByDeviceId(UUID deviceId) {

        return measurementRepository.findByDeviceId(deviceId).stream()
                .map(MeasurementBuilder::toMeasurementDTO)
                .collect(Collectors.toList());
    }
}