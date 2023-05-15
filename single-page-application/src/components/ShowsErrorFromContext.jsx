import React, { useContext, useEffect, useState } from 'react';
import { ErrorContext } from '../context/ErrorContext';

function mapErrorToMessage(error) {
  try {
    const errorMessageObject = JSON.parse(error.message);
    if (errorMessageObject.type === 'StatusRuntimeException' && errorMessageObject.message?.startsWith('NOT_FOUND')) {
      return 'No list of that name found.';
    }
  } catch (e) { /* ignore  */ }
  return error.message;
}

function ShowsErrorFromContext() {
  const { error } = useContext(ErrorContext);
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    if (!error) {
      setIsNew(false);
      return;
    }
    setIsNew(true);
  }, [error]);

  return (error && isNew && (
    <div
      style={{
        position: 'sticky',
        top: '4px',
        zIndex: '999',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '3px',
        background: 'darkred',
        boxShadow: '0px 2px 3px 3px #00000070',
        borderRadius: '3px',
      }}
      role="alert"
    >
      {mapErrorToMessage(error)}
      {' '}
      <button
        style={{
          border: '1px solid black', borderRadius: '3px', padding: '3px', cursor: 'pointer',
        }}
        type="button"
        onClick={() => setIsNew(false)}
      >
        dismiss
      </button>
    </div>
  ));
}

export default ShowsErrorFromContext;
