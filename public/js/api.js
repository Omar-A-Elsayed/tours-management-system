import axios from 'axios';
import { showAlerts } from './alerts';

// create an axios instance
const api = axios.create({
  withCredentials: true,
});

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.get('/api/v1/users/refresh-token');
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);

        if (window.location.pathname !== '/login') {
          showAlerts('error', 'Your session has expired. Please log in again.');
          window.setTimeout(() => {
            location.assign('/login');
          }, 1500);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
