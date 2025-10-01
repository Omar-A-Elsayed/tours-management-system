// /* global Stripe */
import axios from 'axios';
import { showAlerts } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    // console.log(session);

    // 2) Create checkout form + charge credit card
    const stripe = Stripe(
      'pk_test_51S9OMUFNgtQlIxWpFQP9TJekQ8rdiOzoqDpSfwuzJXQtPXnxRhvyPn7Y99hCQViItrIEfWxYrXskoh8UJrvBwoME00gHlfOi8X',
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlerts('error', err.response.data.message);
  }
};
