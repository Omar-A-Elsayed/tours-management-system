const { AppError } = require('./appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyToken = async (token) => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET).catch(() => {
    throw new AppError('Invalid token, please try logging in again.', 401);
  });
};

// WITHOUT PROMISIFY
// jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//   if (err) {
//     console.log('Token is invalid');
//   } else {
//     console.log(decoded);
//   }
// });

module.exports = { verifyToken };
