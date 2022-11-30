package com.headissue.compliance;

import com.google.gson.*;
import com.headissue.compliance.component.ChannelFactory;
import grpc.health.v1.HealthGrpc;
import grpc.health.v1.HealthGrpc.HealthBlockingStub;
import grpc.health.v1.HealthOuterClass;
import grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import io.grpc.ManagedChannel;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class Health extends HttpServlet {

    private final ManagedChannel channel = ChannelFactory.buildChannel("TODO_SERVICE_HOST", "localhost:8081");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean toDoServiceServing = false;
        try {
            HealthBlockingStub healthStub = HealthGrpc.newBlockingStub(channel);
            HealthCheckResponse healthCheckResponse = healthStub.check(HealthOuterClass.HealthCheckRequest.getDefaultInstance());
            toDoServiceServing = healthCheckResponse.getStatus().equals(HealthCheckResponse.ServingStatus.SERVING);
        } catch (Exception e) {
            // ignore
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        JsonObject servicesHealth = new JsonObject();
        servicesHealth.add("services", new JsonArray());
        JsonObject bffServiceHealth = new JsonObject();
        bffServiceHealth.add("name", new JsonPrimitive("bff"));
        bffServiceHealth.add("serving", new JsonPrimitive(true));
        JsonObject toDoServiceHealth = new JsonObject();
        toDoServiceHealth.add("name", new JsonPrimitive("todo"));
        toDoServiceHealth.add("serving", new JsonPrimitive(toDoServiceServing));
        servicesHealth.get("services").getAsJsonArray().add(bffServiceHealth);
        servicesHealth.get("services").getAsJsonArray().add(toDoServiceHealth);
        response.getWriter().println(servicesHealth);
    }
}