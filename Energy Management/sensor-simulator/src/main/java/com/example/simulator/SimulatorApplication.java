package com.example.simulator;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*; // Am adaugat importuri pt List, Random
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class SimulatorApplication implements CommandLineRunner {

    private final RabbitTemplate rabbitTemplate;
    private final List<String> DEVICE_IDS = Arrays.asList(
            "6cac146d-1610-40a8-816b-db4c24288dab",
            "6cac146d-1610-40a8-816b-db4c24288dab",
            "fca6fa1c-16c5-419a-b2f4-789ab2f12582",
            "43368b21-bb43-4552-a666-ff93064bda50",
            "72aeab8e-ab07-43ef-996a-697a089fba69"
    );

    private final Random random = new Random();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public SimulatorApplication(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(SimulatorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- SIMULATOR PORNIT CU MULTIPLE DEVICE-uri ---");
        System.out.println("Device-uri disponibile: " + DEVICE_IDS.size());

        try {
            while (true) {
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(getClass().getResourceAsStream("/sensor.csv")))) {

                    String line;
                    while ((line = br.readLine()) != null) {
                        if (line.trim().isEmpty()) continue;

                        try {
                            String randomIdString = DEVICE_IDS.get(random.nextInt(DEVICE_IDS.size()));
                            UUID deviceId = UUID.fromString(randomIdString);

                            double measurement = Double.parseDouble(line.trim());
                            long timestamp = System.currentTimeMillis();

                            SensorMessage message = new SensorMessage(timestamp, deviceId, measurement);

                            rabbitTemplate.convertAndSend(RabbitMqConfig.SENSOR_QUEUE, message);

                            String formattedDate = dateFormat.format(new Date(timestamp));
                            System.out.println("Trimis: " + measurement + " kWh | Device: " + deviceId.toString().substring(0, 8) + "...");

                            TimeUnit.MILLISECONDS.sleep(3500);

                        } catch (NumberFormatException e) {
                            System.err.println("Linie invalida in CSV: " + line);
                        }
                    }
                }
                System.out.println("--- Fisier terminat. Reiau... ---");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}