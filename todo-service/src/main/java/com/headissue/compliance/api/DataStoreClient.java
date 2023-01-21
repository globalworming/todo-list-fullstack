package com.headissue.compliance.api;

import com.google.cloud.datastore.Key;
import com.headissue.compliance.todo.v1.Todo;

import java.util.List;

public interface DataStoreClient {
    void createTodoList(String name, List<Todo.ToDo> toDosList);

    Key createRandomDocument();

    void deleteDocument(Key key);

    Todo.ToDoList queryToDoList(String id);
}
