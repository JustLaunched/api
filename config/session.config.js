const expressSession = require('express-session');
const MongoStore = require('connect-mongo');

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'super secret (change it)',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: Number(process.env.SESSION_MAX_AGE) || 3600000,
    sameSite: 'none'
  },
  store: new MongoStore({
    ttl: Number(process.env.SESSION_MAX_AGE) || 3600,
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/justlaunched',
    mongoOptions: { useUnifiedTopology: true }
  })
});

module.exports = session;
