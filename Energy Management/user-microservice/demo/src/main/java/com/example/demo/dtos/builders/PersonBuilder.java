package com.example.demo.dtos.builders;

import com.example.demo.dtos.PersonDTO;
import com.example.demo.dtos.PersonDetailsDTO;
import com.example.demo.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(),
                person.getName(),
                person.getAge(),
                person.getAddress(),
                person.getRole());
    }


    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
        return new PersonDetailsDTO(person.getId(),
                person.getName(),
                person.getAddress(),
                person.getAge(),
                person.getRole());
    }


    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(
                personDetailsDTO.getId(),
                personDetailsDTO.getName(),
                personDetailsDTO.getAddress(),
                personDetailsDTO.getAge(),
                personDetailsDTO.getRole());
    }
}