package com.example.demo.services;

import com.example.demo.dtos.PersonDTO;
import com.example.demo.dtos.PersonDetailsDTO;
import com.example.demo.dtos.UserSyncDTO; // Asigura-te ca ai importat DTO-ul creat mai sus
import com.example.demo.dtos.builders.PersonBuilder;
import com.example.demo.entities.Person;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate; // Import necesar

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final RestTemplate restTemplate; // 1. Injectam RestTemplate

    // URL-ul catre Device Service (Port 8081 obligatoriu aici)
    private final String DEVICE_SERVICE_URL = "http://device-service:8081/sync/users";
    private final String AUTH_SERVICE_URL = "http://auth-service:8082/auth/users/";

    @Autowired
    public PersonService(PersonRepository personRepository, RestTemplate restTemplate) {
        this.personRepository = personRepository;
        this.restTemplate = restTemplate;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(PersonDetailsDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());

        // --- SINCRONIZARE ---
        try {
            restTemplate.postForObject(DEVICE_SERVICE_URL, new UserSyncDTO(person.getId(), person.getName()), Void.class);
            LOGGER.info("Sincronizare reusita cu Device Service pentru user ID: {}", person.getId());
        } catch (Exception e) {
            LOGGER.error("Eroare la sincronizarea cu Device Service: {}", e.getMessage());
            // Nu aruncam exceptie mai departe, pentru a nu anula crearea userului
        }

        return person.getId();
    }

    public PersonDetailsDTO update(UUID id, PersonDetailsDTO personDetailsDTO) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }

        Person personToUpdate = personOptional.get();

        personToUpdate.setName(personDetailsDTO.getName());
        personToUpdate.setAddress(personDetailsDTO.getAddress());
        personToUpdate.setAge(personDetailsDTO.getAge());
        personToUpdate.setRole(personDetailsDTO.getRole());

        Person updatedPerson = personRepository.save(personToUpdate);
        LOGGER.debug("Person with id {} was updated in db", updatedPerson.getId());


        try {
            restTemplate.postForObject(DEVICE_SERVICE_URL, new UserSyncDTO(updatedPerson.getId(), updatedPerson.getName()), Void.class);
        } catch (Exception e) {
            LOGGER.error("Eroare la sincronizarea update-ului cu Device Service: {}", e.getMessage());
        }

        return PersonBuilder.toPersonDetailsDTO(updatedPerson);
    }

    public UUID delete(UUID id) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }

        personRepository.deleteById(id);
        LOGGER.debug("Person with id {} was deleted from db", id);

        // --- SINCRONIZARE STERGERE ---
        try {
            // Apelam DELETE pe URL + /id
            restTemplate.delete(DEVICE_SERVICE_URL + "/" + id);
            LOGGER.info("Sincronizare stergere reusita cu Device Service pentru user ID: {}", id);
        } catch (Exception e) {
            LOGGER.error("Eroare la sincronizarea stergerii cu Device Service: {}", e.getMessage());
        }

        // 4. SINCRONIZARE: Stergem si din Auth Service
        try {
            restTemplate.delete(AUTH_SERVICE_URL + id);
            LOGGER.info("Sincronizat stergere credentiale pentru user ID: {}", id);
        } catch (Exception e) {
            LOGGER.error("Eroare la stergerea credentialelor din Auth Service: {}", e.getMessage());
        }

        return id;
    }
}