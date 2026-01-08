package com.example.demo.services;

import com.example.demo.dtos.JwtResponseDTO;
import com.example.demo.dtos.LoginRequestDTO;
import com.example.demo.dtos.RegisterRequestDTO;
import com.example.demo.dtos.builders.UserCredentialBuilder;
import com.example.demo.entities.UserCredential;
import com.example.demo.repositories.UserCredentialRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class AuthService {

    private final UserCredentialRepository userCredentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    // 1. Injectam uneltele necesare pentru Login
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // URL-ul catre User Microservice (pentru sincronizare)
    // Daca esti in Docker foloseste numele containerului: "http://user-microservice:8080/people"
    private final String USER_SERVICE_URL = "http://user-service:8080/people";

    @Autowired
    public AuthService(UserCredentialRepository userCredentialRepository,
                       PasswordEncoder passwordEncoder,
                       RestTemplate restTemplate,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userCredentialRepository = userCredentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.restTemplate = restTemplate;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    public void register(RegisterRequestDTO registerRequestDTO) {
        if (userCredentialRepository.findByUsername(registerRequestDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        UserCredential userCredential = UserCredentialBuilder.toEntity(registerRequestDTO);
        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));

        UserCredential savedUser = userCredentialRepository.save(userCredential);

        try {

            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("id", savedUser.getId());
            userProfile.put("name", registerRequestDTO.getName());
            userProfile.put("age", registerRequestDTO.getAge());
            userProfile.put("address", registerRequestDTO.getAddress());
            userProfile.put("role", registerRequestDTO.getRole().name()); // Trimitem si rolul


            restTemplate.postForObject(USER_SERVICE_URL, userProfile, Void.class);

            LOGGER.info("User sincronizat cu succes catre User Service: {}", registerRequestDTO.getName());

        } catch (Exception e) {

            LOGGER.error("Eroare la sincronizarea cu User Service: {}", e.getMessage());
            // Optional: Poti sterge userul din Auth DB daca vrei sa fie tranzactional (totul sau nimic)
            userCredentialRepository.delete(savedUser);
            throw new RuntimeException("Sincronizarea a esuat. Userul nu a fost creat.");
        }
    }

    // --- METODA DE LOGIN (Noua si Finala) ---
    public JwtResponseDTO login(LoginRequestDTO loginRequest) {
        // 1. Autentificarea propriu-zisa
        // Asta verifica username-ul si parola hash-uita. Daca nu e ok, arunca exceptie.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // 2. Setam autentificarea in contextul de securitate (Spring Security context)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generam Token-ul JWT
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 4. Extragem detaliile userului logat (ID, Role, etc.)
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Extragem rolul (Spring returneaza o lista, noi luam primul element ca String)
        String role = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .findFirst()
                .orElse("CLIENT");

        // 5. Returnam raspunsul complet
        return new JwtResponseDTO(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                role
        );
    }

    // In AuthService.java

    public void deleteUser(UUID id) {
        if (userCredentialRepository.existsById(id)) {
            userCredentialRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}