package com.headissue.compliance;

import io.grpc.health.v1.HealthCheckResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class HealthService {

    private final Logger logger = LoggerFactory.getLogger(HealthService.class);

    private DataStoreClient dataStoreClient;

    public HealthService(DataStoreClient dataStoreClient) {
        this.dataStoreClient = dataStoreClient;
    }

    public Map<String, HealthCheckResponse.ServingStatus> check() {
        try {
            var key = dataStoreClient.createRandomDocument();
            dataStoreClient.deleteDocument(key);
        } catch (Exception e) {
            logger.error("datastore", e);
            return Map.of("dataStore", HealthCheckResponse.ServingStatus.NOT_SERVING);
        }
        return Map.of("dataStore", HealthCheckResponse.ServingStatus.SERVING);
    }
}
