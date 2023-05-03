package com.headissue.compliance;

import com.headissue.compliance.todo.v1.Todo;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

@ExtendWith(ApplicationServerExtension.class)
class LoadListTest {

    @Test
    void whereListDoesNotExists() {
        Mockito.when(ApplicationServerExtension.toDoServiceStub.readList(Mockito.any())).thenThrow(new StatusRuntimeException(Status.NOT_FOUND));

        given()
                .when()
                .get("http://localhost:8001/toDoLists/doesNotExist").
                then()
                .statusCode(400)
                .body("type", equalTo("StatusRuntimeException"))
                .body("message", equalTo("NOT_FOUND"));

    }

}