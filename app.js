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


const requestRoutes = require("./routes/requests");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, 
})
  .then(() => console.log("✅ DB Connected!!"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const dbstore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: "thisshouldbeabettersecret!" },
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

const sessionConfig = {
  store: dbstore,
  name: 'session', // Extra security
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


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxarelvy7/",
];
const styleSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxarelvy7/",
];
const connectSrcUrls = [
  "https://res.cloudinary.com/dxarelvy7/",
];
const fontSrcUrls = [
  "https://fonts.gstatic.com/",
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Fixed: No longer empty
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"], // Fixed: No longer empty
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
  
 
  res.locals.roadmap = [];
  res.locals.progress = [];
  res.locals.live = [];
  res.locals.request = [];
  

  const match = req.path.match(/\/feedback\/([^\/\?]+)/);
  res.locals.currentType = match ? match[1] : "suggestions";
  next();
});

// --- Routes ---
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
  console.log(`✅ Server running on port ${PORT}`);
});