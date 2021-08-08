require('dotenv').config();
import createError from 'http-errors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import path from 'path';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
} as ErrorRequestHandler);

const port = 3000;

app.listen(port, () => console.log( `Server listening at port ${ port }`));

module.exports = app;
