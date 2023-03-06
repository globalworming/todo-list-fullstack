package com.headissue.compliance;

import com.headissue.compliance.todo.v1.Todo;
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
    void whereTodoListIsSaved() {
        Mockito.when(ApplicationServerExtension.toDoServiceStub.readList(Mockito.any())).thenReturn(null);
        Mockito.when(ApplicationServerExtension.toDoServiceStub.writeList(Mockito.any())).thenReturn(Todo.WriteListResult.getDefaultInstance());

        given()
                .contentType(ContentType.JSON).body("{\"name\": \"some list\",\"toDos\": [{\"description\":  \"feed the cat\"}]}")
        .when()
                .post("http://localhost:8080/toDoLists").
        then()
                .statusCode(200);

    }

    @Test

    void whereNameAlreadyExists() {

        Mockito.when(ApplicationServerExtension.toDoServiceStub.readList(Mockito.any())).thenReturn(Todo.ToDoList.getDefaultInstance());

        given()
                .contentType(ContentType.JSON).body("{\"name\": \"some list\",\"toDos\": [{\"description\":  \"feed the cat\"}]}")

                .when()
                .post("http://localhost:8080/toDoLists").
                then()
                .statusCode(400)
        .body("errors[0].path", equalTo("$.name"))
        .body("errors[0].error", equalTo("alreadyexists"));

    }

}