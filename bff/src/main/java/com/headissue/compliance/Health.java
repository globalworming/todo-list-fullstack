package com.headissue.compliance;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import grpc.health.v1.HealthGrpc;
import grpc.health.v1.HealthGrpc.HealthBlockingStub;
import grpc.health.v1.HealthOuterClass;
import grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class Health extends HttpServlet {

    private final Logger logger = LoggerFactory.getLogger(Health.class);
    private final HealthGrpc.HealthBlockingStub todoHealthStub;

    public Health(HealthBlockingStub todoHealthStub) {
        this.todoHealthStub = todoHealthStub;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean toDoServiceServing = false;
        try {
            HealthCheckResponse healthCheckResponse = todoHealthStub.check(HealthOuterClass.HealthCheckRequest.getDefaultInstance());
            toDoServiceServing = healthCheckResponse.getStatus().equals(HealthCheckResponse.ServingStatus.SERVING);
        } catch (Exception e) {
            logger.error("todo-service", e);
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