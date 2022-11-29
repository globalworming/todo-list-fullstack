package com.headissue.compliance;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.protobuf.services.HealthStatusManager;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class GrpcServer {
    public static void main(String[] args) throws IOException, InterruptedException {
        String portEnvVar = System.getenv().get("PORT");
        int port = 8081;
        if (portEnvVar != null && !portEnvVar.equals("")) {
            port = Integer.parseInt(portEnvVar);
        }

        HealthStatusManager health = new HealthStatusManager();
        final Server server = ServerBuilder.forPort(port)
                .addService(health.getHealthService())
                .build()
                .start();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            // Start graceful shutdown
            server.shutdown();
            try {
                // Wait for RPCs to complete processing
                if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
                    // That was plenty of time. Let's cancel the remaining RPCs
                    server.shutdownNow();
                    // shutdownNow isn't instantaneous, so give a bit of time to clean resources up
                    // gracefully. Normally this will be well under a second.
                    server.awaitTermination(5, TimeUnit.SECONDS);
                }
            } catch (InterruptedException ex) {
                server.shutdownNow();
            }
        }));
        // if there are dependencies, check them
        health.setStatus(HealthStatusManager.SERVICE_NAME_ALL_SERVICES, HealthCheckResponse.ServingStatus.SERVING);
        server.awaitTermination();
    }
}

