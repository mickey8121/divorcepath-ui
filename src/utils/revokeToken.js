const revokeToken = () =>
  fetch(process.env.REACT_APP_REVOKE_TOKEN_URL, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());

export default revokeToken;
