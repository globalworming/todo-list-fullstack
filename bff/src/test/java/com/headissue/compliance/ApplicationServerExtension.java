package com.headissue.compliance;

import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import grpc.health.v1.HealthGrpc;
import io.restassured.http.ContentType;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.extension.ExtensionContext.Namespace.GLOBAL;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

public class ApplicationServerExtension
        implements BeforeAllCallback, ExtensionContext.Store.CloseableResource {

    public static HealthGrpc.HealthBlockingStub toDoHealthStub = mock(HealthGrpc.HealthBlockingStub.class, RETURNS_DEEP_STUBS);
    public static ToDoServiceGrpc.ToDoServiceBlockingStub toDoServiceStub = mock(ToDoServiceGrpc.ToDoServiceBlockingStub.class, RETURNS_DEEP_STUBS);
    private Thread app =
            new Thread(
                    () -> {
                        ServletApplication.test(toDoHealthStub, toDoServiceStub);
                    });

    public Thread getApp() {
        return app;
    }

    @Override
    public void beforeAll(ExtensionContext context) {
        ExtensionContext.Store store = context.getRoot().getStore(GLOBAL);
        ApplicationServerExtension extension =
                (ApplicationServerExtension) store.get("application server");
        if (extension == null) {
            app.start();
            store.put("application server", this);
            Awaitility.await().atMost(10, TimeUnit.SECONDS).until(() -> this.getStatus() != 0);
        } else {
            app = extension.getApp();
        }
    }

    @Override
    public void close() {
        app.interrupt();
    }

    public int getStatus() {
        try {
            return given()
                    .accept(ContentType.JSON)
                    .get("http://localhost:8080")
                    .then()
                    .extract()
                    .statusCode();
        } catch (Exception e){
            return 0;
        }
     }

}
