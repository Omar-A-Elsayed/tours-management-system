const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const { catchAsync, AppError } = require('./../utils');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
    populate: {
      path: 'user',
      fields: 'name photo',
    },
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    locations: JSON.stringify(tour.locations),
  });
});

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     populate: {
//       path: 'user',
//       select: 'name photo',
//     },
//   });

//   res.status(200).render('tour', {
//     title: `${tour.name} Tour`,
//     tour,
//   });
// });

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    // user: req.user,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
