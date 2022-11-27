const getNewToken = () =>
  fetch(process.env.REACT_APP_REFRESH_TOKEN_URL, { method: 'POST', credentials: 'include' })
    .then(res => res.json())
    .then(res => {
      if (res?.accessToken) localStorage.setItem('authToken', res.accessToken);

      return res?.accessToken;
    });

export default getNewToken;
