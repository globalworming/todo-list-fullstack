package com.headissue.compliance.servlet;

import com.google.gson.Gson;
import com.google.protobuf.util.JsonFormat;
import com.headissue.compliance.domain.ToDoList;
import com.headissue.compliance.error.ValidationException;
import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import com.headissue.compliance.todo.v1.Todo;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.jetty.http.MimeTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

public class ToDoListServlet extends HttpServlet {

    private final Logger logger = LoggerFactory.getLogger(ToDoListServlet.class);
    private final Gson gson = new Gson();
    private final ToDoServiceGrpc.ToDoServiceBlockingStub todoService;

    public ToDoListServlet(ToDoServiceGrpc.ToDoServiceBlockingStub todoService) {
        this.todoService = todoService;
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BufferedReader reader = req.getReader();
        ToDoList toDoList = gson.fromJson(reader, ToDoList.class);
        validate(toDoList);
        Todo.WriteListResult writeListResult = todoService.writeList(Todo.ToDoList.newBuilder()
                .setId(toDoList.name())
                .addAllToDos(toDoList.toDos().stream().map(it -> Todo.ToDo.newBuilder()
                        .setDescription(it.description())
                        .build()).collect(Collectors.toList()))
                .build());
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType(MimeTypes.Type.TEXT_JSON_UTF_8.asString());
        resp.getWriter().println(JsonFormat.printer().print(writeListResult));
    }

    private void validate(ToDoList toDoList) {
        if (toDoList.toDos() == null) {
            throw new ValidationException(toDoList.getClass().getSimpleName(), "is null", "$.toDos");
        }
        if (toDoList.toDos().isEmpty()) {
            throw new ValidationException(toDoList.getClass().getSimpleName(), "is empty", "$.toDos");
        }
        // TODO check name already taken and throw validation error
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String id = Arrays.stream(req.getPathInfo().split("/")).reduce((first, second) -> second).orElseThrow();
        Todo.ToDoList toDoList = todoService.readList(Todo.ToDoListRequest.newBuilder().setId(id).build());
        resp.setContentType(MimeTypes.Type.TEXT_JSON_UTF_8.asString());
        resp.getWriter().write(JsonFormat.printer().print(toDoList));
    }
}