const path = require('path');
const express = require('express');
// const { log } = require('console');
// const { request } = require('http');
const morgan = require('morgan');
// const exp = require('constants');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const { AppError } = require('./utils');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'", 'https://unpkg.com'],

        styleSrc: [
          "'self'",

          "'unsafe-inline'",

          'https://unpkg.com',

          'https://fonts.googleapis.com',
        ],

        fontSrc: ["'self'", 'https://fonts.gstatic.com'],

        imgSrc: [
          "'self'",

          'data:',

          'https://res.cloudinary.com',

          'https://unpkg.com',

          'https://a.tile.openstreetmap.org',

          'https://b.tile.openstreetmap.org',

          'https://c.tile.openstreetmap.org',
        ],

        connectSrc: ["'self'"],
      },
    },
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(express.json());

// Data sanization against NoSql query injection
app.use(mongoSanitize());

// Data sanization against XSS
app.use(xss());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

// Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
