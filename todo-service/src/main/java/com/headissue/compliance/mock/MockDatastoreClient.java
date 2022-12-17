package com.headissue.compliance.mock;

import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.Key;
import com.headissue.compliance.todo.v1.Todo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import static io.grpc.Status.Code.ALREADY_EXISTS;

public class MockDatastoreClient implements com.headissue.compliance.api.DataStoreClient {

    private final Map<String, List<Todo.ToDo>> mapsNameToToDo = new HashMap<>();
    private final Random random = new Random();

    @Override
    public void createTodoList(String name, List<Todo.ToDo> toDosList) {
        if (mapsNameToToDo.containsKey(name)) {
            throw new DatastoreException(ALREADY_EXISTS.value(), "entity already exists", "");
        }
        mapsNameToToDo.put(name, toDosList);
    }

    @Override
    public Key createRandomDocument() {
        Key build = Key.newBuilder("mock", "kind", random.nextInt()).build();
        return build;
    }

    @Override
    public void deleteDocument(Key key) {
        mapsNameToToDo.remove(key.getName());
    }

    @Override
    public Todo.ToDoList queryToDoList(String id) {
        return Todo.ToDoList.newBuilder()
                .addAllToDos(mapsNameToToDo.get(id))
                .setId(id)
                .build();
    }
}
