import React, { useEffect, useState } from 'react';

function ServerStatus({ url }) {
  const [init, setInit] = useState(false);
  const [connected, setConnected] = useState([]);

  useEffect(() => {
    function fetchHealth() {
      fetch(url)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('expecting status 200');
          } else {
            return res.json();
          }
        })
        .then((data) => {
          setConnected(data.services);
          setInit(true);
        }).catch(() => {
          setConnected([]);
          setInit(true);
        });
    }
    fetchHealth();
    const interval = setInterval(() => fetchHealth(), (10000));
    return () => clearInterval(interval);
  }, [connected.length]);

  if (!init) {
    return <span role="status">-</span>;
  }
  if (connected.length > 0) {
    const services = connected.map((service) => (
      <p key={service.name}>
        {service.name}
        {' '}
        {service.serving ? 'ok' : 'error'}
      </p>
    ));
    return (
      <span role="status">{services}</span>
    );
  }
  return (
    <span role="status">
      disconnected
    </span>
  );
}

export default ServerStatus;
