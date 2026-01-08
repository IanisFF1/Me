FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app

# Copiem jar-ul generat (folosim wildcard *.jar ca sa nu gresim versiunea)
COPY demo/target/*.jar app.jar

# Expunem portul pe care ruleaza Auth Service
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]