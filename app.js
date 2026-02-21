require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const User = require("./models/user");
const requestRoutes = require("./routes/requests");
const ExpressError = require("./utils/ExpressError");

const app = express();


const dbUri = process.env.NODE_ENV === "test" 
  ? process.env.MONGO_URI_TEST 
  : process.env.MONGO_URI;


if (mongoose.connection.readyState === 0) { 
  mongoose.connect(dbUri)
    .then(() => console.log("DB Connected:", mongoose.connection.name))
    .catch(err => console.error("DB Connection Error:", err));
}


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


app.use(session({
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use("/", requestRoutes);

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong!";
  res.status(statusCode).render("feedback/error", { err });
});

module.exports = app;