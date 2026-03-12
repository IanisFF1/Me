package com.example.demo.repositories;

import com.example.demo.entities.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MeasurementRepository extends JpaRepository<Measurement, UUID> {

    List<Measurement> findByDeviceId(UUID deviceId);
    @Query("SELECT SUM(m.measurementValue) FROM Measurement m " +
            "WHERE m.deviceId = :deviceId " +
            "AND m.timestamp >= :startTime " +
            "AND m.timestamp < :endTime")
    Double getTotalConsumptionForInterval(@Param("deviceId") UUID deviceId,
                                          @Param("startTime") long startTime,
                                          @Param("endTime") long endTime);
}