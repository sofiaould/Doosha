const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
       cookie: {
        maxAge:2*7*24*3600*1000 // 2 semaines de session
       },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
      })
    })
  );
};
