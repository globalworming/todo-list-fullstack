import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import TodoItem from './TodoItem';
import SaveList from './SaveList';
import LoadList from './LoadList';
import { ToDoListContext } from '../context/ToDoListContext';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [editName, setEditName] = useState(false);
  const {
    name, setName, toDos, addToDo, clearCompleted,
  } = useContext(ToDoListContext);

  const onNewValue = (event) => {
    setNewTodo(event.target.value);
  };

  const anyCompleted = toDos?.some((todo) => todo.completed);
  const left = toDos?.reduce((acc, curr) => acc + (curr.completed ? 0 : 1), 0);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setEditName(false);
    }
  };

  function onAddTodo(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const title = e.target.value.trim();

      if (title.length > 0) {
        addToDo(title);
      }
      setNewTodo('');
    }
  }

  return (
    <>
      <header className="header">
        <div className="list-name">
          {editName || <h1>{name}</h1>}
          {editName || <button onClick={() => setEditName(true)} type="button" data-testid="edit-name">edit name</button>}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          {editName && <h1><input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} /></h1>}
          {editName && <button onClick={() => setEditName(false)} type="button" data-testid="done-edit-name">done</button>}
          <SaveList />
          <LoadList />

        </div>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={onAddTodo}
          value={newTodo}
          onChange={onNewValue}
        />
      </header>

      {toDos.length > 0 && (
        <section className="main">
          <ul className="todo-list">
            {toDos.map((toDo) => (
              <TodoItem key={toDo.id} toDo={toDo} />
            ))}
          </ul>
        </section>
      )}

      {toDos.length > 0 && (
        <footer className="footer">
          <span className="todo-count" data-testid="count">
            <strong>{left}</strong>
            {' '}
            {left === 1 ? 'item' : 'items'}
            {' '}
            left
          </span>
          <ul className="filters">
            <li>
              <NavLink exact to="/" activeClassName="selected">
                All
              </NavLink>
            </li>
            <li>
              <NavLink to="/active" activeClassName="selected">
                Active
              </NavLink>
            </li>
            <li>
              <NavLink to="/completed" activeClassName="selected">
                Completed
              </NavLink>
            </li>
          </ul>
          {anyCompleted && (
            <button type="button" className="clear-completed" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
}
