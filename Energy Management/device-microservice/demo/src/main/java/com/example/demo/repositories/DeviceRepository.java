package com.example.demo.repositories;

import com.example.demo.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    List<Device> findByName(String name);
    List<Device> findByUserId(UUID userId);

    /**
     * Example: Custom query
     */


    // Aceasta este magia SQL: "Seteaza userId pe null unde userId este egal cu cel primit"
    @Modifying      // Spune Spring-ului ca facem UPDATE/DELETE, nu SELECT
    @Transactional  // Obligatoriu pentru operatii care modifica date
    @Query("UPDATE Device d SET d.userId = null WHERE d.userId = :userId")
    void detachDevicesFromUser(@Param("userId") UUID userId);
}



