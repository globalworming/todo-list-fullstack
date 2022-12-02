package com.headissue.compliance;

import jakarta.servlet.DispatcherType;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.EnumSet;

import static jakarta.servlet.DispatcherType.FORWARD;
import static jakarta.servlet.DispatcherType.REQUEST;
import static org.eclipse.jetty.servlet.ServletContextHandler.NO_SESSIONS;

public class ServletApplication {

    private static final Logger logger = LoggerFactory.getLogger(ServletApplication.class);

    public static void main(String[] args) {
        String portEnvVar = System.getenv().get("PORT");
        int port = 8080;
        if (portEnvVar != null && !portEnvVar.equals("")) {
            port = Integer.parseInt(portEnvVar);
        }

        Server server = new Server(port);

        ServletContextHandler servletHandler = new ServletContextHandler(NO_SESSIONS);
        servletHandler.addFilter(LoggingContextSettingFilter.class, "/*", EnumSet.of(REQUEST, FORWARD, DispatcherType.ERROR));
        servletHandler.addFilter(AllowAllCorsFilter.class, "/*", EnumSet.of(REQUEST, FORWARD));
        servletHandler.addServlet(Health.class, "/health");
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

