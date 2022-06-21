require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const createError = require('http-errors');
// const path = require('path');
const logger = require('morgan');
const router = require('./config/routes.config');
const session = require('./config/session.config');
const passport = require('./config/passport.config');
const cors = require('./config/cors.config');
require('./config/db.config');
const app = express();

app.use(express.json());
app.use(logger('dev'));
app.set("trust proxy", 1);
app.use(session);
app.use(cors);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
// This is actually preventing logs
// app.use(express.static(path.join(__dirname, 'public')));

// configure routes
app.use('/api/v0', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// error handler
app.use((error, req, res) => {
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error);
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(404, 'Resource not found');
  } else if (!error.status) {
    error = createError(500, error);
  }

  const data = { message: '', errors: {} };
  data.message = error.message;
  data.errors = error.errors
    ? Object.keys(error.errors).reduce(
      (errors, key) => ({ ...errors, [key]: error.errors[key]?.message || error.errors[key] }),
      {}
    )
    : undefined;

  res.status(error.status).json(data);
});

const port = 3000;

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server listening at port ${port}`)
});

module.exports = app;
