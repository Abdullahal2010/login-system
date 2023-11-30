require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((error) => {
    console.log({
      message: "mongodb failed to connect",
      error: error,
    });
    process.exit(1);
  });
