import expressSession from 'express-session';
import MongoStore from 'connect-mongostore';

MongoStore(expressSession);

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'super secret (change it)',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: (process.env.SESSION_SECURE && true) || false,
    httpOnly: true,
    maxAge: Number(process.env.SESSION_MAX_AGE) || 3600000
  },
  store: new MongoStore({
    ttl: Number(process.env.SESSION_MAX_AGE) || 3600,
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/justlaunched'
  })
});

export default session;