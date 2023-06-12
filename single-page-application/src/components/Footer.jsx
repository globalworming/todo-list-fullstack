import React from 'react';
import ServerStatus from './ServerStatus';

function Footer() {
  const gateway = process.env.REACT_APP_GATEWAY;
  return (
    <>
      <a href="https://github.com/login/oauth/authorize?client_id=5c3353b85975c9e8cffe&redirect_uri=http://localhost:3000/oauth-callback&state=jsadbasjdvbasjk&">login with github</a>
      {' '}
      <ServerStatus url={`${gateway}/health`} />
    </>
  );
}

export default Footer;
