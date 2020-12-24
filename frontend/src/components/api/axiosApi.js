import axios from 'axios';

const baseURL = process.env.API_URL;
const accessToken = localStorage.getItem('access_token');

const axiosAPI = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Authorization: accessToken ? `JWT ${accessToken}` : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (originalRequest.url === `${baseURL}token/refresh/`) {
        window.location.href = '/login/';
        return Promise.reject(error);
      } else if (error.response.statusText === 'Unauthorized') {
        const refresh = localStorage.getItem('refresh_token');

        if (refresh) {
          const tokenParts = JSON.parse(atob(refresh.split('.')[1]));
          const now = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp > now) {
            try {
              const response = await axiosAPI.post('/token/refresh/', {
                refresh,
              });
              setNewHeaders(response);
              originalRequest.headers[
                'Authorization'
              ] = `JWT ${response.data.access}`;
              return axiosAPI(originalRequest);
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log('Refresh token is expired', tokenParts.exp, now);
            window.location.href = '/login/';
          }
        }
        return Promise.reject(error);
      }
    }
  }
);

export function setNewHeaders(response) {
  axiosAPI.defaults.headers['Authorization'] = `JWT ${response.data.access}`;
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
}

export default axiosAPI;
