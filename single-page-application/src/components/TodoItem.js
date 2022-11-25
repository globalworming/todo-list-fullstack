import React, { useState } from "react";

export default function TodoItem({ todo, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [modifiedTodo, setModifiedTodo] = useState(todo);

  const onCompletion = async () => {
    onUpdate({ detail: { type: 'toggleCompletion', id: todo.id } })
  }

  const onDelete = async () => {
    onUpdate({ detail: { type: 'delete', id: todo.id } })
  }

  const onNewValue = event => {
    setModifiedTodo({ ...modifiedTodo, title: event.target.value })
  }

  const onKeyDown = event => {
    switch (event.key) {
      case 'Escape':
        setModifiedTodo(todo);
        setEditing(false);
        break;

      case 'Enter':
        handleTitleUpdate();
        setEditing(false);
        break;

      default:
        break;
    }
  }

  const onBlur = () => {
    handleTitleUpdate();
    setEditing(false);
  }

  const handleTitleUpdate = () => {
    const trimmedTitle = modifiedTodo.title.trim();
    trimmedTitle.length > 0 ?
      onUpdate({
        detail: {
          type: 'update',
          todo: { ...modifiedTodo, title: trimmedTitle }
        }
      }) :
      onDelete();
  }

  // Set to editing on double click
  const handleViewClick = event => {
    switch (event.detail) {
      case 2:
        setEditing(true)
        break;

      default:
        break;
    }
  }

  return (
    <li
      onClick={handleViewClick}
      className={`${editing ? "editing" : ""} ${todo.completed ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed}
          onChange={onCompletion}
        />
        <label>{todo.title}</label>
        <button className="destroy" onClick={onDelete} />
      </div>
      {editing && (
        <input
          className="edit"
          value={modifiedTodo.title}
          onChange={onNewValue}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      )}
    </li>
  );
}
