
# Energy Management Platform - Distributed Microservices System

This project is a scalable, distributed platform designed for managing energy consumption, users, and smart devices. It features a microservices architecture orchestrated with **Docker Swarm**, real-time data processing with a custom load balancer, and an AI-driven support chat integrated with **Google Gemini**.

## Architecture Overview

The platform uses a distributed approach where services are containerized and deployed as a Swarm Stack. **Traefik** acts as the API Gateway, routing external traffic to the appropriate microservices.

### Key Components

* **Orchestration**: Docker Swarm Mode (Replicas, Overlay Networking).
* **Communication**: RabbitMQ (Asynchronous messaging) & REST APIs (Synchronous).
* **Real-Time Updates**: WebSocket for live charts and chat.
* **Data Ingestion**: A scalable pipeline where a Load Balancer distributes sensor data across multiple Monitoring instances using **Consistent Hashing**.
* **AI Integration**: A smart chat system powered by Google Gemini 2.5 Flash.

## Services Description

* **`frontend`**: A React-based user interface for managing devices, viewing real-time charts, and chatting with support.
* **`traefik`**: The Reverse Proxy & API Gateway. It exposes all services on port `80`.
* **`load-balancer`**: A specialized microservice that consumes raw sensor data from RabbitMQ and routes it to specific `monitoring-service` queues based on Device ID hashing.
* **`monitoring-service`**: Runs in multiple replicas (scalable). Each replica processes data from a dedicated queue assigned via Swarm configuration.
* **`chat-service`**: Manages customer support conversations. It integrates **Google Gemini** for automated responses and implements a "Smart Back-off" mechanism (AI pauses if a human admin intervenes).
* **`websocket-service`**: Handles real-time broadcasting for notifications and chat messages.
* **`sensor-simulator`**: A producer service that generates dummy energy consumption data.
* **`auth-service`**: Handles JWT authentication and authorization.
* **`user-service`**: Manages user accounts and roles (Admin/Client).
* **`device-service`**: Manages smart device inventory and mapping.
* **`rabbitmq`**: The message broker used for the sensor data pipeline and inter-service events.
* **`Databases`**: Four dedicated PostgreSQL instances (`user-db`, `device-db`, `credentials-db`, `measurements-db`, `chat-db`).

## Prerequisites

* **Docker** & **Docker Compose** installed.
* **Docker Swarm** initialized:
    ```bash
    docker swarm init
    ```

## Configuration

The project requires a `.env` file in the root directory to configure the AI integration and scaling parameters.

Create a file named **`.env`** with the following content:

```env
GEMINI_API_KEY=AIzaSyB...your_key_here...
MONITORING_REPLICAS_COUNT=2
```

## Installation & Running

Since Docker Swarm does not support building images during deployment, the process involves three main steps: compiling the code, building the images, and deploying the stack.

### 1. Compile Java Applications (Generate JARs)

Before building the Docker images, you must compile the Java code to create the necessary `.jar` files.
Navigate to the root/demo directory of each Java microservice (`user-microservice`, `device-microservice`, `auth-microservice`, `monitoring-microservice`, `chat-microservice`, `load-balancer-microservice`, `websocket-microservice`) and run the following command:

```bash
./mvnw clean package -DskipTests
```

*Note: Ensure you run this in the folder containing the `pom.xml` and `mvnw` file for each service.*

### 2. Build the Docker Images

Once the JAR files are generated, build the Docker images locally using the compose file:

```bash
docker-compose build
```

### 3. Deploy to Swarm

Deploy the entire stack to the Swarm cluster using the configuration file:

```bash
docker stack deploy -c docker-compose.yml energy_stack
```

### 4. Verify Deployment

Check if all services are up and running (ensure `monitoring-service` has the correct number of replicas):

```bash
docker service ls
```

### 5. Start the Data Simulation

By default, the `sensor-simulator` is deployed with `0` replicas to prevent data flooding. To start generating data:

```bash
docker service scale energy_stack_sensor-simulator=1
```

To stop the simulation:

```bash
docker service scale energy_stack_sensor-simulator=0
```

### Access Points

* **Frontend Application**: `http://localhost`
* **Traefik Dashboard**: `http://localhost:8088/dashboard/`
* **RabbitMQ Management**: `http://localhost:15672` (User: `guest`, Pass: `guest`)

### Smart Load Balancing

The system uses a **Consistent Hashing** strategy to distribute load.

1. The `sensor-simulator` pushes data to a central queue.
2. The `load-balancer` service calculates a hash of the Device ID.
3. Based on the hash, data is forwarded to a specific queue (e.g., `monitoring-queue-1`).
4. The corresponding `monitoring-service` replica (identified by its Swarm Instance ID) processes the data.

### AI & Human Support Chat

* **Automated AI**: Users can ask questions about energy consumption, and the AI (Gemini) will answer instantly.

## Stopping the Application

To shut down the entire stack and remove the services (data volumes are preserved):

```bash
docker stack rm energy_stack
```

## Default Credentials

**Databases (PostgreSQL)**

* User: `postgres`
* Password: `ianis1234`
* Port: Internal `5432`

**RabbitMQ**

* User: `guest`
* Password: `guest`
