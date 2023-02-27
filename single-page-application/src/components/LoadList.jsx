import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ErrorContext } from '../context/ErrorContext';

function SaveList({ toDos, onUpdate, setListName }) {
  const errorCtx = useContext(ErrorContext);
  const [name, setName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [captureName, setCaptureName] = useState(false);

  // eslint-disable-next-line no-unused-vars
  function loadList(id) {
    const requestOptions = {
      method: 'GET',
    };
    setLoading(true);
    fetch(`${process.env.REACT_APP_GATEWAY}/toDoLists/${encodeURIComponent(id)}`, requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then((data) => {
        toDos.forEach((toDo) => {
          onUpdate({ detail: { type: 'delete', id: toDo.id } });
        });
        setListName(data.name);
        data.toDos.map(async (toDo) => {
          console.log(toDo);
          await onUpdate({
            detail: {
              type: 'add',
              todo: {
                id: uuid(),
                title: toDo.description,
                completed: false,
              },
            },
          });
        });
        setLoading(false);
        setCaptureName(false);
      })
      .catch((err) => {
        setLoading(false);
        errorCtx.setError(err);
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadList(name);
    }
  };

  if (captureName) {
    return (
      <>
        <input
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            setCaptureName(false);
            setName('');
          }}
          data-testid="save-list"
          type="submit"
          disabled={loading}
        >
          {loading ? 'loading...' : 'cancel'}
        </button>
      </>
    );
  }
  return (

    <button onClick={() => setCaptureName(true)} data-testid="load-list" type="submit">load</button>

  );
}

export default SaveList;
