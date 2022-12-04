package com.headissue.compliance;

import com.google.protobuf.Any;
import com.google.rpc.Code;
import com.google.rpc.ErrorInfo;
import com.headissue.compliance.todo.v1.ToDoServiceGrpc;
import com.headissue.compliance.todo.v1.Todo;
import io.grpc.protobuf.StatusProto;
import io.grpc.stub.StreamObserver;

public class ToDoService extends ToDoServiceGrpc.ToDoServiceImplBase {
    @Override
    public void writeList(Todo.ToDoList request, StreamObserver<Todo.WriteListResult> responseObserver) {

        com.google.rpc.Status status = com.google.rpc.Status.newBuilder()
                .setCode(Code.UNIMPLEMENTED.getNumber())
                .setMessage("Not implemented yet")
                .build();
        responseObserver.onError(StatusProto.toStatusRuntimeException(status));
    }
}
