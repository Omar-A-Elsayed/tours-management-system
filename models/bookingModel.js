const mongoose = require('mongoose');
const { AppError } = require('./../utils');
const Tour = require('./tourModel');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: { type: Number, required: [true, 'Booking must have a price.'] },
  createdAt: { type: Date, default: Date.now() },
  paid: { type: Boolean, default: true },
  startDate: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Booking must have a start date instance.'],
  },
});

bookingSchema.pre('save', async function (next) {
  const tour = await Tour.findById(this.tour);
  const dateInstance = tour.startDates.id(this.startDate);

  if (dateInstance.participants >= tour.maxGroupSize) {
    return next(new AppError('Sorry, this date is sold out!', 400));
  }

  dateInstance.participants += 1;
  if (dateInstance.participants === tour.maxGroupSize) {
    dateInstance.soldOut = true;
  }

  await tour.save({ validateBeforeSave: false });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
