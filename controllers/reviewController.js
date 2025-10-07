const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const { catchAsync, AppError } = require('./../utils');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);

exports.checkIfBooked = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const tourId = req.body.tour;

  const booking = await Booking.findOne({ user: userId, tour: tourId });

  if (!booking) {
    return next(
      new AppError('You can only review tours that you have booked!', 403), // 403 Forbidden
    );
  }

  next();
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
