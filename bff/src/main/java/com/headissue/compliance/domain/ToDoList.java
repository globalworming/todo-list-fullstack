package com.headissue.compliance.domain;

import java.util.List;

public record ToDoList(
        String name,
        List<ToDoListItem> toDos
) {
    public record ToDoListItem(String description){}
}
