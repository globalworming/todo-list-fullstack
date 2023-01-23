import React, { useContext, useState } from 'react';
import { ErrorContext } from '../context/ErrorContext';

function SaveList({ toDoList }) {
  const errorCtx = useContext(ErrorContext);
  const [ok, setOk] = useState(undefined);

  function saveList() {
    if (!toDoList) {
      errorCtx.setError(new Error('toDo list is empty'));
      return;
    }
    if (!toDoList.toDos) {
      errorCtx.setError(new Error('toDo list has no toDos'));
      return;
    }
    if (!toDoList.toDos.length <= 0) {
      errorCtx.setError(new Error('toDo list has no items'));
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toDoList),
    };
    fetch('/toDoLists', requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          const resp = await response.json();
          throw new Error(`${resp.message} ${JSON.stringify(resp.errors)}`);
        }
        return response.json();
      })
      .then(() => setOk(true))
      .catch((err) => errorCtx.setError(err));
  }

  return (
    <button onClick={saveList} className={`save-list ${ok ? 'save-list-ok' : ''}`} type="submit">
      save
      list
    </button>
  );
}

export default SaveList;
