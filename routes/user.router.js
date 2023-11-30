const express = require("express");
const {
  registerPage,
  loginPage,
  profilePage,
  registerUser,
  logoutUser,
  checkLoginProfile,
  checkLoginLoginReg,
  loginUser,
} = require("../controllers/user.controller");
const router = express();

const passport = require("passport");
require("../config/passport");

// /register : get - returns the register page
router.get("/register", checkLoginLoginReg, registerPage);

// /register : post - registers an user
router.post("/register", registerUser);

// /login : get - returns the login page
router.get("/login", checkLoginLoginReg, loginPage);

// /login : post - logins an user
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  loginUser
);

// /profile : post - returns the profile page (protected route)
router.get("/profile", checkLoginProfile, profilePage);

// /logout : get - logouts an user
router.get("/logout", logoutUser);

// exporting the router for using from the app.js
module.exports = router;
