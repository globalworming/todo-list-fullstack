import React, { useContext, useState } from 'react';
import { ToDoListContext } from '../context/ToDoListContext';

function ToDoItem({ toDo }) {
  const { updateToDo, deleteToDo } = useContext(ToDoListContext);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(toDo.description);

  const onNewValue = (e) => {
    setDescription(e.target.value);
  };

  const onCheckChange = () => {
    updateToDo({ ...toDo, done: !toDo.done });
  };

  const onDelete = () => {
    deleteToDo(toDo);
  };

  const handleTitleUpdate = () => {
    const trimmedTitle = description.trim();
    if (trimmedTitle.length > 0) {
      updateToDo({ ...toDo, description: trimmedTitle });
    } else {
      deleteToDo(toDo);
    }
  };

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        setDescription(toDo.description);
        setEditing(false);
        break;

      case 'Enter':
        handleTitleUpdate();
        setEditing(false);
        break;

      default:
        break;
    }
  };

  const onBlur = () => {
    handleTitleUpdate();
    setEditing(false);
  };

  // Set to editing on double click
  const handleViewClick = (event) => {
    switch (event.detail) {
      case 2:
        setEditing(true);
        break;

      default:
        break;
    }
  };

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,
      jsx-a11y/no-noninteractive-element-interactions */
    <li
      onClick={handleViewClick}
      className={`${editing ? 'editing' : ''} ${
        toDo.done ? 'completed' : ''
      }`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={toDo.done}
          onChange={onCheckChange}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>{ description}</label>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button type="button" className="destroy" onClick={onDelete} />
      </div>
      {editing && (
        <input
          className="edit"
          value={description}
          onChange={onNewValue}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      )}
    </li>
  );
}

export default ToDoItem;
