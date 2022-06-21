const createError = require('http-errors');
const cors = require('cors');

const allowedOrigins = (['http://localhost:8083', 'https://justlaunched.xy'])
  .split(',')
  .map(o => o.trim());

module.exports = cors({
  credentials: true,
  origin: (origin, next) => {
    const allowed = !origin || allowedOrigins.indexOf(origin) !== -1;
    if (allowed) {
      next(null, allowed);
    } else {
      next(createError(401, 'Not allowed by CORS'));
    }
  }
});
