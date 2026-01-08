package com.example.demo.dtos;


import com.example.demo.entities.Role;
import java.util.Objects;
import java.util.UUID;

public class PersonDTO {
    private UUID id;
    private String name;
    private int age;
    private Role role;
    private String address;

    public PersonDTO() {}

    public PersonDTO(UUID id, String name, int age, String address, Role role) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.address = address;
        this.role = role;
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getAddress() { return address; }

    public void setAddress(String address) {
        this.address = address;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PersonDTO that = (PersonDTO) o;
        return age == that.age &&
                Objects.equals(name, that.name) &&
                role == that.role;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age, role);
    }
}