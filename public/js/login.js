/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';
import api, { setAccessToken } from './api';
export const login = async (email, password) => {
  try {
    const res = await api.post('/api/v1/users/login', {
      email,
      password,
    });

    if (res.data.status === 'success') {
      setAccessToken(res.data.accessToken);
      showAlerts('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlerts('error', err.response.data.error);
  }
};

export const logout = async () => {
  try {
    const res = await api.get('api/v1/users/logout');

    if (res.data.status === 'success') {
      setAccessToken(null);
      location.reload(true);
    }
  } catch (err) {
    showAlerts('error', 'Error logging out! Try again.');
  }
};
