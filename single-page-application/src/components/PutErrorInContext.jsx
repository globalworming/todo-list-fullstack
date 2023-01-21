import { useContext, useEffect } from 'react';
import { ErrorContext } from '../context/ErrorContext';

function PutErrorInContext({ error }) {
  const errorCtx = useContext(ErrorContext);
  useEffect(() => {
    errorCtx.setError(error);
  }, []);
  return null;
}

export default PutErrorInContext;
