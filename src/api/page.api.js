import { API_ROOT } from './api-config';

const pageApi = {
  get(path) {
    const url = `${API_ROOT}/${path}`;

    // TODO authen
    return fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          return { data: result.data };
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          return {
            error: error,
            data: []
          };
        }
      )
  },

  getPages() {
    return this.get("pages");
  },
};

export default pageApi;