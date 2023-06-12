import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function OauthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  useEffect(() => {
    if (!code) return;
  //  function fetchToken() {
  //    fetch(`https://github.com/login/oauth/access_token?client_id=xxx&client_secret=xxx&code=${code}`, { method: 'POST', mode: 'no-cors' })
  //      .then((res) => res.text())
  //      .then((data) => {
  //        console.log(data);
  //      }).catch((err) => {
  //        console.error(err);
  //      });
  //  }
  //  fetchToken();
  }, [code]);
  console.log(searchParams);
  return (
    <>
      <p>called</p>
      <p>
        it
        {' '}
        {searchParams.get('code')}
      </p>
    </>
  );
}

export default OauthCallback;
