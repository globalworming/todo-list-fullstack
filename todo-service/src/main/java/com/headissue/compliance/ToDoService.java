package com.headissue.compliance;

import com.google.cloud.datastore.DatastoreException;
import com.google.protobuf.Any;
import com.google.rpc.ErrorInfo;
import com.headissue.compliance.api.DataStoreClient;
import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import com.headissue.compliance.todo.v1.Todo;
import io.grpc.protobuf.StatusProto;
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
        try {
            Todo.ToDoList toDoList = dataStore.queryToDoList(request.getId());
            responseObserver.onNext(toDoList);
            responseObserver.onCompleted();
        } catch (DatastoreException e) {
            com.google.rpc.Status status = com.google.rpc.Status.newBuilder()
                    .setCode(e.getCode())
                    .setMessage(e.getMessage())
                    .build();
            responseObserver.onError(StatusProto.toStatusRuntimeException(status));
        }
    }
}
