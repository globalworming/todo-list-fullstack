package com.headissue.compliance;

import com.headissue.compliance.mock.MockDatastoreClient;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.protobuf.services.HealthStatusManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class GrpcServer {

  private static final Logger logger = LoggerFactory.getLogger(GrpcServer.class);

  public static void main(String[] args) throws IOException, InterruptedException {
    String portEnvVar = System.getenv().get("PORT");
    int port = 8082;
    if (portEnvVar != null && !portEnvVar.equals("")) {
      port = Integer.parseInt(portEnvVar);
    }

    com.headissue.compliance.api.DataStoreClient dataStore;
    if (Boolean.parseBoolean(System.getenv().get("MOCK_DATASTORE"))) {
      dataStore = new MockDatastoreClient();
    } else {
      dataStore = new DataStoreClientImpl();
    }

    HealthStatusManager health = new HealthStatusManager();
    final Server server =
        ServerBuilder.forPort(port)
            .addService(health.getHealthService())
            // FIXME
            // .addService(new ToDoService(dataStore))
            .build()
            .start();
    Runtime.getRuntime()
        .addShutdownHook(
            new Thread(
                () -> {
                  // Start graceful shutdown
                  server.shutdown();
                  try {
                    // Wait for RPCs to complete processing
                    if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
                      // That was plenty of time. Let's cancel the remaining RPCs
                      server.shutdownNow();
                      // shutdownNow isn't instantaneous, so give a bit of time to clean resources
                      // up
                      // gracefully. Normally this will be well under a second.
                      server.awaitTermination(5, TimeUnit.SECONDS);
                    }
                  } catch (InterruptedException ex) {
                    server.shutdownNow();
                  }
                }));
    Map<String, HealthCheckResponse.ServingStatus> serviceToStatus =
        new HealthService(dataStore).check();
    if (!serviceToStatus.values().stream()
        .allMatch(s -> s.equals(HealthCheckResponse.ServingStatus.SERVING))) {
      health.setStatus(
          HealthStatusManager.SERVICE_NAME_ALL_SERVICES,
          HealthCheckResponse.ServingStatus.NOT_SERVING);
    }
    server.awaitTermination();
  }
}
