const Tour = require('../models/tourModel');
const { catchAsync } = require('./../utils');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
    populate: {
      path: 'user',
      fields: 'name photo',
    },
  });

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
