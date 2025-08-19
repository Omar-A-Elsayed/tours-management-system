import axios from 'axios';
import { showAlerts } from './alerts';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
  console.log('Updating settings:', data, type);
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') {
      console.log('User data updated successfully:', res.data);

      showAlerts('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlerts('error', err.response.data.message);
  }
};
