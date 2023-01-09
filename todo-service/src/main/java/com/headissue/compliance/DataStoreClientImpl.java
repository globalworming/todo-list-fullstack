package com.headissue.compliance;

import com.google.cloud.datastore.*;
import com.headissue.compliance.api.DataStoreClient;
import com.headissue.compliance.todo.v1.Todo;

import java.util.ArrayList;
import java.util.List;

public class DataStoreClientImpl implements DataStoreClient {
    public static final String TO_DO_LIST_ITEM = "ToDoListItem";
    public static final String TO_DO_LIST = "ToDoList";
    private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    @Override
    public void createTodoList(String name, List<Todo.ToDo> toDosList) {
        ArrayList<FullEntity<? extends IncompleteKey>> entities = new ArrayList<>();
        FullEntity<Key> list = Entity.newBuilder(toDoListKey(name)).build();
        entities.add(list);
        for (Todo.ToDo toDo : toDosList) {
            entities.add(Entity
                    .newBuilder(datastore.newKeyFactory().setKind(TO_DO_LIST_ITEM).newKey())
                    .set("toDoListKey", list.getKey())
                    .set("description", toDo.getDescription())
                    .build());
        }
        datastore.add(entities.toArray(new FullEntity[0]));
    }

    private Key toDoListKey(String name) {
        return datastore.newKeyFactory().setKind(TO_DO_LIST).newKey(name);
    }

    @Override
    public Key createRandomDocument() {
        IncompleteKey taskKey = datastore.newKeyFactory().setKind("HealthTest").newKey();
        FullEntity<IncompleteKey> task = Entity.newBuilder(taskKey).build();
        return datastore.put(task).getKey();
    }

    @Override
    public void deleteDocument(Key key) {
        datastore.delete(key);
    }

    @Override
    public Todo.ToDoList queryToDoList(String id) {
        Entity toDoList = datastore.get(toDoListKey(id));
        Query<Entity> query =
                Query.newEntityQueryBuilder()
                        .setKind(TO_DO_LIST_ITEM)
                        .setFilter(
                                StructuredQuery.PropertyFilter.eq("toDoListKey", toDoList.getKey()))
                        .build();

        QueryResults<Entity> toDoListItems = datastore.run(query);
        Todo.ToDoList.Builder builder = Todo.ToDoList.newBuilder().setId(toDoList.getKey().getName());
        toDoListItems.forEachRemaining(item -> {
            builder.addToDos(Todo.ToDo.newBuilder().setDescription(item.getString("description")).build());
        });
        return builder.build();
    }
}
