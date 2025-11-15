import api, { setAccessToken } from './api';
import { showAlerts } from './alerts';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
  console.log('Updating settings:', data, type);
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const res = await api.patch(url, data);

    if (res.data.status === 'success') {
      showAlerts('success', `${type.toUpperCase()} updated successfully!`);

      if (type === 'password') {
        window.setTimeout(() => {
          setAccessToken(null);
          location.assign('/login');
        }, 2000);
      }
    }
  } catch (err) {
    showAlerts('error', err.response.data.message);
  }
};
