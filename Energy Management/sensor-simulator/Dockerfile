FROM maven:3.8.3-openjdk-17 AS builder
COPY ./src/ /root/src
COPY ./pom.xml /root/
WORKDIR /root
RUN mvn package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY --from=builder /root/target/*.jar /app/app.jar

# Comanda de start
ENTRYPOINT ["java", "-jar", "/app/app.jar"]