package com.example.demo.services;

import com.example.demo.dtos.PersonDTO;
import com.example.demo.dtos.PersonDetailsDTO;
import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.dtos.builders.PersonBuilder;
import com.example.demo.entities.Person;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dtos.SyncMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;

    private final String DEVICE_SERVICE_URL = "http://device-service:8081/sync/users";
    private final String AUTH_SERVICE_URL = "http://auth-service:8082/auth/users/";

    @Autowired
    public PersonService(PersonRepository personRepository, RestTemplate restTemplate, RabbitTemplate rabbitTemplate) {
        this.personRepository = personRepository;
        this.restTemplate = restTemplate;
        this.rabbitTemplate = rabbitTemplate;
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

        try {
            Map<String, Object> details = new HashMap<>();
            details.put("name", person.getName());

            SyncMessage message = new SyncMessage(
                    person.getId(),
                    "CREATE",
                    "USER",
                    details
            );

            rabbitTemplate.convertAndSend(RabbitMqConfig.USER_DEVICE_QUEUE, message);

            LOGGER.info("Mesaj RabbitMQ trimis: CREATE USER {}", person.getId());

        } catch (Exception e) {
            LOGGER.error("Eroare la trimiterea mesajului RabbitMQ: {}", e.getMessage());
        }

        return person.getId();
    }

    public PersonDetailsDTO update(UUID id, PersonDetailsDTO personDetailsDTO) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (!personOptional.isPresent()) {
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }

        Person personToUpdate = personOptional.get();

        personToUpdate.setName(personDetailsDTO.getName());
        personToUpdate.setAddress(personDetailsDTO.getAddress());
        personToUpdate.setAge(personDetailsDTO.getAge());

        Person updatedPerson = personRepository.save(personToUpdate);
        LOGGER.debug("Person with id {} was updated in db", updatedPerson.getId());

        try {
            Map<String, Object> details = new HashMap<>();
            details.put("name", updatedPerson.getName());

            SyncMessage message = new SyncMessage(
                    updatedPerson.getId(),
                    "UPDATE",
                    "USER",
                    details
            );

            rabbitTemplate.convertAndSend(RabbitMqConfig.USER_DEVICE_QUEUE, message);
            LOGGER.info("Mesaj RabbitMQ trimis: UPDATE USER {}", updatedPerson.getId());

        } catch (Exception e) {
            LOGGER.error("Eroare la trimiterea mesajului de update RabbitMQ: {}", e.getMessage());
        }

        return PersonBuilder.toPersonDetailsDTO(updatedPerson);
    }

    public UUID delete(UUID id) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (!personOptional.isPresent()) {
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }

        personRepository.deleteById(id);
        LOGGER.debug("Person with id {} was deleted from db", id);

        try {
            SyncMessage message = new SyncMessage(
                    id,
                    "DELETE",
                    "USER",
                    null
            );

            rabbitTemplate.convertAndSend(RabbitMqConfig.USER_DEVICE_QUEUE, message);
            LOGGER.info("Mesaj RabbitMQ trimis: DELETE USER {}", id);

        } catch (Exception e) {
            LOGGER.error("Eroare la trimiterea mesajului de stergere RabbitMQ: {}", e.getMessage());
        }



        return id;
    }
}