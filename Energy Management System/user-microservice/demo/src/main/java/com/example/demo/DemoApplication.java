package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// Adaugă acest Bean pentru a putea face request-uri către celălalt microserviciu
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

}