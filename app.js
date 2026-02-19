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

// --- Database ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected!"))
  .catch(err => console.error("DB Connection Error:", err));

// --- View Engine ---
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// --- Session & Flash ---
app.use(session({
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Make variables available to templates ---
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// --- Routes ---
app.use("/", requestRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// --- Catch all for 404 ---
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err); // prevent double responses
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong!";
  res.status(statusCode).render("feedback/error", { err });
});

// --- Start Server ---
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
