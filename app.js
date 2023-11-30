const express = require("express");
const app = express();
require("dotenv").config();

// handling form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ejs and layouts //
const expressLayout = require("express-ejs-layouts");

app.use(expressLayout);
app.set("layout", "./layouts/default-layout");
app.set("view engine", "ejs");

// database //
require("./config/db");

// session management
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "session",
    }),
    // cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userRouter = require("./routes/user.router");
app.use(userRouter);

// Navigation
const { homeRoute } = require("./controllers/user.controller");
app.get("/", homeRoute);

// wrong route
app.use((req, res, next) => {
  res.status(404).json({
    message: "wrong route",
  });
});

// externel routes

// exporting the app for listining it from the index.js file
module.exports = app;
