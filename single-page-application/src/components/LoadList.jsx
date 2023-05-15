import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ErrorContext } from '../context/ErrorContext';
import { ToDoListContext } from '../context/ToDoListContext';
import ToDo from '../model/ToDo';

function LoadList() {
  const { setName, setToDos } = useContext(ToDoListContext);

  const errorCtx = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const [captureName, setCaptureName] = useState(false);
  const [listToLoad, setListToLoad] = useState('');

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
        setName(data.name);
        setToDos(data.toDos.map((it) => new ToDo(uuid(), it.description)));
        setLoading(false);
        setCaptureName(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        setLoading(false);
        errorCtx.setError(err);
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadList(listToLoad);
    }
  };

  if (captureName) {
    return (
      <>
        <input
            // FIXME shouldn't there be a "submit" button or something like that?
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus
          value={listToLoad}
          onChange={(e) => setListToLoad(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            setCaptureName(false);
            setListToLoad('');
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

export default LoadList;
