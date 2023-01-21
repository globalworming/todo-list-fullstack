import React, { useMemo, useState } from 'react';

export const ErrorContext = React.createContext(undefined);

function ErrorDisplayBoundary({ children }) {
  const [error, setError] = useState(null);
  const ctx = useMemo(() => ({ error, setError }), [error]);

  return <ErrorContext.Provider value={ctx}>{children}</ErrorContext.Provider>;
}

export default ErrorDisplayBoundary;
