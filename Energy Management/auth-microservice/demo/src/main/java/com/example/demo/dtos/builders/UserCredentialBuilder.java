package com.example.demo.dtos.builders;

import com.example.demo.dtos.RegisterRequestDTO;
import com.example.demo.entities.UserCredential;

public class UserCredentialBuilder {

    private UserCredentialBuilder() {
    }

    public static UserCredential toEntity(RegisterRequestDTO registerRequestDTO) {
        return new UserCredential(
                registerRequestDTO.getUsername(),
                registerRequestDTO.getPassword(),
                registerRequestDTO.getRole()
        );
    }
}