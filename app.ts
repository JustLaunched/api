import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import createError from 'http-errors';
// import path from 'path';
import logger from 'morgan';
import router from './config/routes.config';
/* @ts-ignore */
import session from './config/session.config';
import passport from './config/passport.config';
import cors from './config/cors.config';
import './config/db.config';
const app: express.Application = express();

app.use(express.json());
app.use(logger('dev'));
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
app.use((error: any, req: any, res: any) => {
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

app.listen(port, () => console.log(`Server listening at port ${port}`));

module.exports = app;
