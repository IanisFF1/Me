package com.example.demo.repositories;

import com.example.demo.entities.Person;
import com.example.demo.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    List<Person> findByName(String name);

    /**
     * Example: Custom query
     */
    List<Person> findByRole(Role role);

}
