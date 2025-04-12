const Tour = require('./../models/tourModel');
const {
  APIFeatures,
  catchAsync,
  BadRequestError,
  AppError,
  validateId,
  validateData,
} = require('./../utils');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log('tours knows authed user', req.user);
  // NORMAL WAY
  // const tours = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });

  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // {difficulty: "easy", duration: {$gte: 5}}

  // 1A) FILTERING
  // const queryObj = { ...req.query };
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // // 2B) Advanced Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  // let query = Tour.find(JSON.parse(queryStr));

  // // 2) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.replaceAll(',', ' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // 3) Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.replaceAll(',', ' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // 4) Pagination
  // const page = Number(req.query.page) || 1;
  // const page = req.query.page * 1 || 1;
  // const limit = Number(req.query.limit) || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) {
  //     throw new Error('This page does not exists');
  //   }
  // }

  // EXECUTE QUERY
  const features = new APIFeatures(Tour, req.query).filter().sort().limiting();
  await features.pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get Tour
exports.getTour = catchAsync(async (req, res, next) => {
  // validate inputs
  // const id = req.params.id;
  // const isValidId = mongoose.Types.ObjectId.isValid(id);
  // if (!isValidId) throw new AppError('Id is not valid', 400);

  validateId(req.params.id);

  // controller logic
  const tour = await Tour.findById(req.params.id).populate('reviews');

  validateData(tour, 'Tour not found');

  // validate output
  // if (!tour) throw new AppError('Tour not found', 404);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Create Tour
exports.createTour = factory.createOne(Tour);

// Update Tour
exports.updateTour = factory.updateOne(Tour);

// Delete Tour
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
