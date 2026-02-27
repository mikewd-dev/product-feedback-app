const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { ObjectID} = mongoose.Types;
const User = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require("./models/reply");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB Connected!!"))
  .catch((err) => console.error(err));

const db = mongoose.connection;

const collection = db.collection("requests");

collection.insertMany(data, function (err, result) {
  if (err) {
    console.error("Error inserting data:", err);
  } else {
    console.log(`${result.insertedCount} documents inserted successfully`);
  }

});
