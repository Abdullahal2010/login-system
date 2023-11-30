const User = require("../models/model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");

let navbarInfo = require("../models/navbarInfo");
let output = null;

exports.homeRoute = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      navbarInfo = true;
    } else {
      navbarInfo = null;
    }
    res.render("index", {
      title: "Home Page",
      navbarInfo: navbarInfo,
      output: output,
    });
    navbarInfo = null;
    output = null;
  } catch (error) {
    res.status(500).send({
      message: error.message,
      some: "internel server error",
    });
  }
};

exports.checkLoginProfile = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

exports.checkLoginLoginReg = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// /register : get - returns the register page
exports.registerPage = (req, res) => {
  res.render("register", { title: "register page", navbarInfo: navbarInfo });
};

// /register : post - registers an user
exports.registerUser = async (req, res) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, async (errr, hash) => {
      const username = req.body.username;
      const password = hash;

      const user = await User.findOne({ username: username });

      if (user) return res.status(400).send("user already exists");

      const newUser = User({
        username: username,
        password: password,
      });

      await newUser.save();

      output = "User is registered";
      res.redirect("/login");
    });
  } catch (error) {
    res.status(500).json({
      message: "Internel server error",
      error: error.message,
    });
  }
};

// /login : post - logins an user (we have already authenticated the user now just rendering our other pages)
exports.loginUser = (req, res, next) => {
  output = "User is logged in";
  res.redirect("/profile");
};

// /login : get - returns the login page
exports.loginPage = (req, res) => {
  res.render("login", {
    title: "login page",
    navbarInfo: navbarInfo,
    output: output,
  });
  output = null;
};

// /profile : get - returns the profile page (protected route)
exports.profilePage = (req, res) => {
  try {
    navbarInfo = true;
    res.render("profile", {
      title: "profile page",
      navbarInfo: navbarInfo,
      output: output,
    });
    navbarInfo = null;
    output = null;
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// /logout : get - logouts an user
exports.logoutUser = (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
      output = "User is logged Out";
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
// ------------- The End ------------- //
