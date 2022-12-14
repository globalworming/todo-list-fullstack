package com.headissue.compliance.servlet;

import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import com.headissue.compliance.todo.v1.Todo;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class ToDoList extends HttpServlet {

    private final Logger logger = LoggerFactory.getLogger(ToDoList.class);
    private final ToDoServiceGrpc.ToDoServiceBlockingStub todoService;

    public ToDoList(ToDoServiceGrpc.ToDoServiceBlockingStub todoService) {
        this.todoService = todoService;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Todo.WriteListResult writeListResult = todoService.writeList(Todo.ToDoList.getDefaultInstance());

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().println(writeListResult);
    }
}