package com.example.demo.dtos;

import com.example.demo.entities.Role;

public class RegisterRequestDTO {
    private String username;
    private String password;
    private Role role;

    // The part to be sent to the user microservice
    private String name;
    private int age;
    private String address;

    public RegisterRequestDTO() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}