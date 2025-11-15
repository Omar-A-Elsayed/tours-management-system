const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/login', viewsController.getLoginForm);

router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewsController.getOverview,
);
router.get('/tour/:slug', viewsController.getTour);
router.get('/me', viewsController.getAccount);
router.get('/my-tours', viewsController.getMyTours);

module.exports = router;
