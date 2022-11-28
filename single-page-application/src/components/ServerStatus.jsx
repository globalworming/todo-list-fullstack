import React, { useEffect, useState } from 'react';

function ServerStatus({ url }) {
  const [connected, setConnected] = useState(undefined);

  useEffect(() => {
    function fetchHealth() {
      fetch(url)
        .then((res) => {
          if (res.status === 200) {
            setConnected(true);
          } else {
            setConnected(false);
          }
        })
        .catch(() => {
          setConnected(false);
        });
    }
    fetchHealth();
    const interval = setInterval(() => fetchHealth(), (10000));
    return () => clearInterval(interval);
  });

  if (connected === undefined) {
    return <span role="status">-</span>;
  }
  if (connected) {
    return <span role="status">ok</span>;
  }
  return (
    <span role="status">
      error
    </span>
  );
}

export default ServerStatus;
