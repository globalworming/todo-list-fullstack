import React, { useContext, useState } from 'react';
import { ErrorContext } from '../context/ErrorContext';
import ToDoList from '../model/ToDoList';
import ToDo from '../model/ToDo';

function SaveList({ toDoList }) {
  const errorCtx = useContext(ErrorContext);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function saveList() {
    if (!toDoList) {
      errorCtx.setError(new Error('toDo list is empty'));
      return;
    }
    if (!toDoList.toDos) {
      errorCtx.setError(new Error('toDo list has no toDos'));
      return;
    }
    if (toDoList.toDos.length <= 0) {
      errorCtx.setError(new Error('toDo list has no items'));
      return;
    }
    const toDoListToSend = new ToDoList(
      toDoList.name,
      toDoList.toDos.map((todo) => new ToDo(todo.title)),
    );
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toDoListToSend),
    };
    setSaving(true);
    fetch(`${process.env.REACT_APP_GATEWAY}/toDoLists`, requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          if (response.headers.get('Content-Type').startsWith('text/html')) {
            throw new Error(await response.text());
          }
          const resp = await response.json();
          if (resp.errors?.length > 0) {
            throw new Error(`${resp.message} ${JSON.stringify(resp.errors)}`);
          }
          throw new Error(`${resp.message}`);
        }
      })
      .then(() => {
        setSaved(true);
        setSaving(false);
      })
      .catch((err) => {
        setSaving(false);
        setSaved(false);
        errorCtx.setError(err);
      });
  }

  if (saved) {
    return <button type="button" disabled data-testid="saved-list"> saved</button>;
  }

  if (saving) {
    return <button type="button" disabled> saving...</button>;
  }
  return (

    <button onClick={saveList} data-testid="save-list" type="submit">save</button>

  );
}

export default SaveList;
