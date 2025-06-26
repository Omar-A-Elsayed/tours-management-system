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

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
