package com.headissue.compliance;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import static io.restassured.RestAssured.*;
import static org.hamcrest.CoreMatchers.equalTo;

@ExtendWith(ApplicationServerExtension.class)
class SaveListTest {

    @Test
    void whereTodoListIsEmpty() {
        given()
                .contentType(ContentType.JSON).body("{\"name\": \"some list\",\"toDos\": []}")
        .when()
                .post("http://localhost:8080/toDoLists").
        then()
                .body("errors[0].path", equalTo("$.toDos"));

    }

    @Test
    @Disabled
    void whereTodoListIsSaved() {
        // FIXME, mock success response
        Mockito.when(ApplicationServerExtension.toDoServiceStub.writeList(Mockito.any())).thenThrow(new RuntimeException("test"));

        given()
                .contentType(ContentType.JSON).body("{\"name\": \"some list\",\"toDos\": [{\"description\":  \"feed the cat\"}]}")
        .when()
                .post("http://localhost:8080/toDoLists").
        then()
                .statusCode(200);

    }
}