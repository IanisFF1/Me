package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtRequestFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Eroare token: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.validateToken(jwt)) {

                // 1. Extragem rolurile "brute" (care pot fi String sau LinkedHashMap)
                List<?> rawRoles = jwtUtil.extractRoles(jwt);

                // 2. Le convertim cu atentie
                List<SimpleGrantedAuthority> authorities = rawRoles.stream()
                        .map(role -> {
                            // Cazul 1: Rolul e deja String ("CLIENT")
                            if (role instanceof String) {
                                return new SimpleGrantedAuthority((String) role);
                            }
                            // Cazul 2: Rolul e un Obiect ({authority=CLIENT}) - Cazul tau actual
                            else if (role instanceof java.util.Map) {
                                return new SimpleGrantedAuthority((String) ((java.util.Map) role).get("authority"));
                            }
                            // Fallback
                            else {
                                return new SimpleGrantedAuthority(String.valueOf(role));
                            }
                        })
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}