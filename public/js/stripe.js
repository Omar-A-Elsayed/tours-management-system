// /* global Stripe */
import axios from 'axios';
import { showAlerts } from './alerts';
import api from './api';

const stripe = Stripe(
  'pk_test_51S9OMUFNgtQlIxWpFQP9TJekQ8rdiOzoqDpSfwuzJXQtPXnxRhvyPn7Y99hCQViItrIEfWxYrXskoh8UJrvBwoME00gHlfOi8X',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await api.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlerts('error', err.response.data.message);
  }
};
