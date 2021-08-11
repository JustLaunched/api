import type { ErrorRequestHandler } from 'express';
import express from 'express';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import { routes as router } from './config/routes.config';
require('dotenv').config();

const app: express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// configure routes
app.use('/api/v0', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
} as ErrorRequestHandler);

const port = 3000;

app.listen(port, () => console.log(`Server listening at port ${port}`));

module.exports = app;
