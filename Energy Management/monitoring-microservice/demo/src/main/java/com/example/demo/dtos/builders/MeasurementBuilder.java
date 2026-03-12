package com.example.demo.dtos.builders;

import com.example.demo.dtos.MeasurementDTO;
import com.example.demo.dtos.SensorMessage;
import com.example.demo.entities.Measurement;

public class MeasurementBuilder {

    private MeasurementBuilder() {
    }

    public static MeasurementDTO toMeasurementDTO(Measurement measurement) {
        return new MeasurementDTO(
                measurement.getId(),
                measurement.getDeviceId(),
                measurement.getTimestamp(),
                measurement.getMeasurementValue());
    }

    public static Measurement toEntity(SensorMessage message) {
        return new Measurement(
                message.getDeviceId(),
                message.getTimestamp(),
                message.getMeasurementValue()
        );
    }
}