package com.headissue.compliance;

import com.google.gson.*;
import grpc.health.v1.HealthGrpc;
import grpc.health.v1.Todo;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class Health extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean toDoServiceServing = false;
        try {
            ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 8081).usePlaintext().build();
            HealthGrpc.HealthBlockingStub healthStub = HealthGrpc.newBlockingStub(channel);
            Todo.HealthCheckResponse healthCheckResponse = healthStub.check(Todo.HealthCheckRequest.getDefaultInstance());
            toDoServiceServing = healthCheckResponse.getStatus().equals(Todo.HealthCheckResponse.ServingStatus.SERVING);
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
        response.getWriter().println(bffServiceHealth);
    }
}