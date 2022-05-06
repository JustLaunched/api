import createError from 'http-errors';
import cors from 'cors';

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:8083')
  .split(',')
  .map(o => o.trim());

export default cors({
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
