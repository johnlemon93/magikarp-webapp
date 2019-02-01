import { API_ROOT } from './api-config';

const authenApi = {
  // TODO (lec): encrypt the password before sending out?
  login(username, password) {
    const url = `${API_ROOT}/auth/login`;
    const data = { username, password };

    return fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      mode: "cors"
    })
      .then(response => response.json())
      .then(res => {
        return res;
      })
      .catch(error => {
        console.error(error);
        return {
          success: false,
          error: error
        }
      });
  }
};

export default authenApi;