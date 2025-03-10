module.exports = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 500;

  res.status(err.statusCode).json({
    status: err.status,
    error: err.message || 'fail',
    data: null,
  });
};
