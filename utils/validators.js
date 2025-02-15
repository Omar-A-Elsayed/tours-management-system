const mongoose = require('mongoose');
const { AppError } = require('./appError');

// input validation
const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Id is not valid', 400);
  }
};

// output validation
const validateData = (data, errorMessage) => {
  if (!data) {
    throw new AppError(errorMessage, 404);
  }
};

module.exports = {
  validateId,
  validateData,
};
