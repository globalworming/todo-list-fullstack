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

    private final String todoServiceHost;
    private final ManagedChannel channel;

    {
        String _todoServiceHost = System.getenv("TODO_SERVICE_HOST");
        if (_todoServiceHost == null) {
            todoServiceHost = "localhost:8081";
        } else {
            todoServiceHost = _todoServiceHost.replace("https://", "");
        }
        if (todoServiceHost.startsWith("localhost")) {
            channel = plainTextChannel().build();
        } else {
            channel = tlsChannel().build();
        }
    }

    private ManagedChannelBuilder<?> tlsChannel() {
        return ManagedChannelBuilder.forTarget(todoServiceHost + ":443")
                .useTransportSecurity();
    }

    private ManagedChannelBuilder<?> plainTextChannel() {
        if (!todoServiceHost.contains(":")) {
            throw new RuntimeException("bad target format");
        }
        String hostName = todoServiceHost.split(":")[0];
        String port = todoServiceHost.split(":")[1];
        return ManagedChannelBuilder.forAddress(hostName, Integer.parseInt(port)).usePlaintext();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean toDoServiceServing = false;
        try {
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