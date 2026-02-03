require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const ejsMate = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const crypto = require("crypto");


const User = require("./models/user");
const Request = require("./models/request");


const requestRoutes = require("./routes/requests");
const ExpressError = require("./utils/ExpressError");


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected!!"))
  .catch((err) => console.error("DB Connection Error:", err));


const dbstore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: process.env.SECRET || "thisshouldbeabettersecret!" },
});


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(mongoSanitize());


app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
  "https://code.jquery.com/",
  "https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com/",
];
const styleSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const fontSrcUrls = ["https://fonts.gstatic.com/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
       defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


app.use(
  session({
    store: dbstore,
    name: "session",
    secret: process.env.SECRET || "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");


  const match = req.path.match(/\/feedback\/([^\/\?]+)/);
  res.locals.currentType = match ? match[1] : "suggestions";

next(); 
});
app.use("/", requestRoutes);


app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
