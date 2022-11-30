package com.headissue.compliance;

import io.grpc.health.v1.HealthCheckResponse;

import java.util.Map;

public class HealthService {
    private DataStoreClient dataStoreClient;

    public HealthService(DataStoreClient dataStoreClient) {
        this.dataStoreClient = dataStoreClient;
    }

    public Map<String, HealthCheckResponse.ServingStatus> check() {
        try {
            var key = dataStoreClient.createRandomDocument();
            dataStoreClient.deleteDocument(key);
        } catch (Exception e) {
            return Map.of("dataStore", HealthCheckResponse.ServingStatus.NOT_SERVING);
        }
        return Map.of("dataStore", HealthCheckResponse.ServingStatus.SERVING);
    }
}
