const passport = require("passport");
const User = require("../models/model");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "user name is wrong" });
      }

      if (!bcrypt.compare(password, user.password)) {
        return done(null, false, { message: "password doesn't match" });
      }

      done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
