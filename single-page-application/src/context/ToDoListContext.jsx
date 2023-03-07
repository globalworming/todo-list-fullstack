import React, { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ToDoModel from '../model/ToDo';

export const ToDoListContext = React.createContext(undefined);

function ToDoListBoundary({ children }) {
  const [name, setName] = useState('todos');
  const [toDos, setToDos] = useState([]);

  const addToDo = (description) => {
    const newToDoList = [...toDos, new ToDoModel(uuid(), description)];
    setToDos(newToDoList);
  };

  const updateToDo = (updatedToDo) => {
    const newToDos = [...toDos];
    const i = newToDos.findIndex((toDo) => toDo.id === updatedToDo.id);
    newToDos[i] = updatedToDo;
    setToDos(newToDos);
  };

  const deleteToDo = (toDo) => {
    const newToDos = [...toDos].filter((it) => it.id !== toDo.id);
    setToDos(newToDos);
  };

  const clearCompleted = () => {
    const newToDoList = [...toDos].filter((todo) => !todo.done);
    setToDos(newToDoList);
  };

  const ctx = useMemo(() => ({
    name, setName, toDos, setToDos, addToDo, updateToDo, deleteToDo, clearCompleted,
  }), [name, JSON.stringify(toDos)]);

  return <ToDoListContext.Provider value={ctx}>{children}</ToDoListContext.Provider>;
}

export default ToDoListBoundary;
