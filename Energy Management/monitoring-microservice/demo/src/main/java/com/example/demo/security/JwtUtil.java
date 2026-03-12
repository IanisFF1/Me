package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Extrage Username-ul din Token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrage Rolurile din Token (ne trebuie pentru autorizare)
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        // "roles" este cheia pe care am pus-o in Auth Service
        return claims.get("roles", List.class);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Valideaza Token-ul
    public Boolean validateToken(String token) {
        // Daca parseClaimsJws nu arunca exceptie, semnatura e buna.
        // Verificam doar daca a expirat.
        return !isTokenExpired(token);
    }
}