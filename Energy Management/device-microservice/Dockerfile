FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app

# Presupunand ca si aici ai structura cu folderul 'demo'
# Daca proiectul tau e direct in radacina, sterge "demo/" din cale
COPY demo/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]