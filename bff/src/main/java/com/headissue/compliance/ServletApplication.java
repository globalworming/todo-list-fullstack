package com.headissue.compliance;

import com.headissue.compliance.component.ChannelFactory;
import com.headissue.compliance.container.LoggingContextInitializer;
import com.headissue.compliance.filter.AllowAllCorsFilter;
import com.headissue.compliance.servlet.Health;
import com.headissue.compliance.servlet.OpenApiSchema;
import com.headissue.compliance.servlet.ToDoList;
import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import grpc.health.v1.HealthGrpc;
import io.grpc.ManagedChannel;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.EnumSet;

import static jakarta.servlet.DispatcherType.FORWARD;
import static jakarta.servlet.DispatcherType.REQUEST;
import static org.eclipse.jetty.servlet.ServletContextHandler.NO_SESSIONS;

public class ServletApplication {

    private static final Logger logger = LoggerFactory.getLogger(ServletApplication.class);

    private static final ManagedChannel todoServiceChannel = ChannelFactory.buildChannel("TODO_SERVICE_HOST", "localhost:8081");

    public static void main(String[] args) {
        String portEnvVar = System.getenv().get("PORT");
        int port = 8080;
        if (portEnvVar != null && !portEnvVar.equals("")) {
            port = Integer.parseInt(portEnvVar);
        }

        Server server = new Server(port);

        ServletContextHandler servletHandler = new ServletContextHandler(NO_SESSIONS);
        servletHandler.addServletContainerInitializer(new LoggingContextInitializer());
        servletHandler.addFilter(AllowAllCorsFilter.class, "/*", EnumSet.of(REQUEST, FORWARD));
        HealthGrpc.HealthBlockingStub todoHealthStub = HealthGrpc.newBlockingStub(todoServiceChannel);
        ServletHolder health = new ServletHolder(new Health(todoHealthStub));
        servletHandler.addServlet(health, "/health");
        ToDoServiceGrpc.ToDoServiceBlockingStub toDoServiceStub = ToDoServiceGrpc.newBlockingStub(todoServiceChannel);
        ServletHolder toDoList = new ServletHolder(new ToDoList(toDoServiceStub));
        servletHandler.addServlet(toDoList, "/toDoList");
        servletHandler.addServlet(OpenApiSchema.class, "/openapi.yaml");
        server.setHandler(servletHandler);
        try {
            server.start();
            server.join();
        } catch (Exception ex) {
            logger.error("startup", ex);
            System.exit(1);
        } finally {
            server.destroy();
        }
    }
}

