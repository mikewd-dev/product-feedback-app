// if (process.env.NODE_ENV !== "production"){
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const Joi = require("joi");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });
const ejsMate = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");
const requestRoutes = require("./routes/requests");
const User = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require("./models/reply");
const Roadmap = require("./models/roadmap");
const bodyParser = require("body-parser");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(() => console.log("DB Connected!!"))
  .catch((err) => console.error(err));

const dbstore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: "thisshouldbeabettersecret!" },
});

dbstore.on("error", function (e) {
  console.log("Session Store Error", e);
});

app.set("trust proxy", 1); 


const sessionConfig = {
  store: dbstore,
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxarelvy7/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxarelvy7/",
];
const connectSrcUrls = [
  "https://res.cloudinary.com/dxarelvy7/",
  "https://fonts.gstatic.com/",
];
const fontSrcUrls = [
  "https://res.cloudinary.com/dxarelvy7/",
  "https://fonts.gstatic.com/",
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/dxarelvy7/",
          "https://images.unsplash.com/",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
        mediaSrc: ["https://res.cloudinary.com/dxarelvy7/"],
        childSrc: ["blob:"],
        scriptSrcAttr: ["'unsafe-inline'"], 
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

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

//--- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.locals.roadmap = [];
  res.locals.progress = [];
  res.locals.live = [];
  res.locals.request = [];
  next();
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use("/styles", express.static(path.join(__dirname, "public/styles")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use((req, res, next) => {
  const match = req.path.match(/\/feedback\/([^\/\?]+)/);
  res.locals.currentType = match ? match[1] : "suggestions";
  next();
});

// --- Routes ---
app.use("/", requestRoutes);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// --- Auth guard example ---
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/feedback/login");
}

// --- Start server ---
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
