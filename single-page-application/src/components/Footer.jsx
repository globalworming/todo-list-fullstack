import React from 'react';
import ServerStatus from './ServerStatus';

function Footer() {
  const gateway = process.env.REACT_APP_GATEWAY;
  return <ServerStatus url={gateway} />;
}

export default Footer;
