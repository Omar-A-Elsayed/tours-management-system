const bcrypt = require('bcryptjs');
const { query } = require('express');
const User = require('./../models/userModel');
const { APIFeatures, catchAsync, AppError } = require('./../utils');

// exports.getAllUsers = async (req, res) => {
//   // res.status(500).json({
//   //   status: 'error',
//   //   message: 'This route is not defined',
//   // });
//   try {
//     // FILTERING
//     const queryObj = { ...req.query };
//     const excludeFields = ['page', 'sort', 'limit', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     let usersQuery = User.find(queryObj);

//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.replaceAll(',', ' ');
//       usersQuery = usersQuery.sort(sortBy);
//     } else {
//       usersQuery = usersQuery.sort('name');
//     }

//     // Field Limiting
//     if (req.query.fields) {
//       const fields = req.query.fields.replaceAll(',', ' ');
//       usersQuery = usersQuery.select(fields);
//     }

//     // Pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 100;
//     const skip = (page - 1) * limit;
//     usersQuery = usersQuery.skip(skip).limit(limit);
//     const numUsers = await User.countDocuments();
//     if (skip >= numUsers) {
//       throw new Error('This page does not exists');
//     }

//     const users = await usersQuery;

//     res.status(200).json({
//       status: 'success',
//       results: users.length,
//       data: {
//         users,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    const features = new APIFeatures(User, req.query)
      .filter()
      .sort()
      .limiting();
    await features.pagination();
    const users = await features.query;

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    // console.debug(err);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not defined',
  // });
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'no user found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not defined',
  // });
  try {
    const newUser = await User.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateUser = catchAsync(async (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not defined',
  // });
  if (req.body.password) {
    if (!req.body.passwordConfirm)
      throw new AppError('must provide a password confirm', 400);
    if (req.body.password !== req.body.passwordConfirm)
      throw new AppError('passwords are not the same', 400);
    delete req.body.passwordConfirm;
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return document after update
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = async (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not defined',
  // });
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getUSerStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: { active: true },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
