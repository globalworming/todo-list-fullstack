package com.headissue.compliance;

import com.headissue.compliance.api.DataStoreClient;
import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import com.headissue.compliance.todo.v1.Todo;
import io.grpc.stub.StreamObserver;

public class ToDoService extends ToDoServiceGrpc.ToDoServiceImplBase {

    private final com.headissue.compliance.api.DataStoreClient dataStore;

    public ToDoService(DataStoreClient dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public void writeList(Todo.ToDoList request, StreamObserver<Todo.WriteListResult> responseObserver) {
        dataStore.createTodoList(request.getId(), request.getToDosList());
        responseObserver.onNext(Todo.WriteListResult.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    public void readList(Todo.ToDoListRequest request, StreamObserver<Todo.ToDoList> responseObserver) {
        responseObserver.onNext(dataStore.queryToDoList(request.getId()));
        responseObserver.onCompleted();
    }
}
