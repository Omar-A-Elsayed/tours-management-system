class BadRequestError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 400;
    this.status = 'fail';
    this.isOpertional = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  BadRequestError,
};
