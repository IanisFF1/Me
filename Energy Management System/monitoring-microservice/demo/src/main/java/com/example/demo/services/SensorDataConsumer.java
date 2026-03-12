package com.example.demo.services;

import com.example.demo.dtos.NotificationDTO;
import com.example.demo.dtos.SensorMessage;
import com.example.demo.dtos.builders.MeasurementBuilder;
import com.example.demo.entities.Measurement;
import com.example.demo.entities.MonitoredDevice;
import com.example.demo.repositories.MeasurementRepository;
import com.example.demo.repositories.MonitoredDeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SensorDataConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(SensorDataConsumer.class);

    private final MeasurementRepository measurementRepository;
    private final MonitoredDeviceRepository deviceRepository;
    private final RabbitTemplate rabbitTemplate;

    public SensorDataConsumer(MeasurementRepository measurementRepository,
                              MonitoredDeviceRepository deviceRepository,
                              RabbitTemplate rabbitTemplate) {
        this.measurementRepository = measurementRepository;
        this.deviceRepository = deviceRepository;
        this.rabbitTemplate = rabbitTemplate;
    }


    @RabbitListener(queues = "${monitoring.queue.name}")
    @Transactional
    public void consumeSensorData(SensorMessage message) {

        LOGGER.info("Mesaj primit pe coada dedicata: {}", message.getMeasurementValue());

        Measurement measurement = MeasurementBuilder.toEntity(message);
        measurementRepository.save(measurement);

        rabbitTemplate.convertAndSend("measurements-queue", message);

        checkHourlyConsumption(message);
    }

    private void checkHourlyConsumption(SensorMessage message) {

        Optional<MonitoredDevice> deviceOpt = deviceRepository.findById(message.getDeviceId());

        if (deviceOpt.isPresent()) {
            MonitoredDevice device = deviceOpt.get();
            long timestamp = message.getTimestamp();

            long oneHourInMillis = 3600000;
            long startHour = timestamp - (timestamp % oneHourInMillis);
            long endHour = startHour + oneHourInMillis;

            Double totalConsumption = measurementRepository.getTotalConsumptionForInterval(
                    device.getId(), startHour, endHour
            );

            if (totalConsumption == null) {
                totalConsumption = message.getMeasurementValue();
            }

            if (totalConsumption > device.getMaxHourlyConsumption()) {
                LOGGER.warn("ALERTA! Depasire consum total orar!");

                String formattedMessage = String.format(
                        "Alerta! Device-ul '%s' a depasit consumul! Valoare: %.2f kWh (Limita: %.2f)",
                        device.getDeviceName(),
                        totalConsumption,
                        device.getMaxHourlyConsumption()
                );

                NotificationDTO alert = new NotificationDTO(formattedMessage, device.getUserId(), device.getId(), totalConsumption);
                rabbitTemplate.convertAndSend("notification-queue", alert);
            }
        }
    }
}