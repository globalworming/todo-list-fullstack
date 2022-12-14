import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import TodoItem from './TodoItem';
import { reducer, useAsyncReducer } from '../state';

export default function TodoList({ match }) {
  const [todos, dispatch] = useAsyncReducer(reducer, []);
  const [newTodo, setNewTodo] = useState('');

  const onNewValue = (event) => {
    setNewTodo(event.target.value);
  };

  const onAddTodo = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const title = event.target.value.trim();

      if (title.length > 0) {
        const todo = {
          id: uuid(),
          title,
          completed: false,
        };
        await dispatch({ type: 'add', value: todo });
      }

      setNewTodo('');
    }
  };

  const updateTodo = async (event) => {
    const { type, id, todo } = event.detail;

    switch (type) {
      case 'toggleCompletion':
        await dispatch({ type: 'toggleCompletion', value: id });
        break;

      case 'update':
        await dispatch({ type: 'update', value: todo });
        break;

      case 'delete':
        await dispatch({ type: 'delete', value: id });
        break;

      default:
        break;
    }
  };

  const onClearCompleted = async () => {
    await dispatch({ type: 'clearCompleted' });
  };
  const visibleTodos = match.params.filter
    ? todos.filter((todo) => (match.params.filter === 'active' ? !todo.completed : todo.completed))
    : todos ?? [];

  const allCompleted = visibleTodos.every((todo) => todo.completed);

  const onToggleAll = async () => {
    await dispatch({ type: 'toggleAll', value: allCompleted });
  };

  const anyCompleted = todos?.some((todo) => todo.completed);
  const left = todos?.reduce((acc, curr) => acc + (curr.completed ? 0 : 1), 0);

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={onAddTodo}
          value={newTodo}
          onChange={onNewValue}
        />
      </header>

      {todos?.length > 0 && (
        <section className="main">
          <label htmlFor="toggle-all">
            <input
              id="toggle-all"
              type="checkbox"
              className="toggle-all"
              checked={allCompleted}
              onChange={onToggleAll}
            />
          </label>
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} />
            ))}
          </ul>
        </section>
      )}

      {todos?.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
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
            <button type="button" className="clear-completed" onClick={onClearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
}
