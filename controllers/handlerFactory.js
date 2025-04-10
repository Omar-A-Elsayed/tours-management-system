const { catchAsync, AppError } = require('./../utils');
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // controller logic
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
