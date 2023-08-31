if (process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const router = express.Router();
const serverless = require('serverless-http')
const methodOverride = require("method-override");
const flash = require('connect-flash')
const Joi  = require('joi')
const path = require("path")
const {storage} = require('./cloudinary')
const multer = require('multer')
const upload = multer({storage})
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require("mongoose");
const session = require('express-session')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI,
    { useUnifiedTopology: true})
    .then(()=> console.log('DB Connected!!'))
    .catch(err=> console.error(err))

const ejsMate = require("ejs-mate");
const requestRoutes = require('./routes/requests');
const User = require("./models/user");

const bodyParser = require('body-parser');
const ExpressError = require('./utils/ExpressError');

const db = mongoose.connection;

// app.use('/.product-feedback-app/functions/product-feedback-app-figma', router)

app.use('/', requestRoutes)

app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash())

app.use ((req, res, next)=>{
    res.locals.messages = req.flash('success')
    next()
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

function isLoggedIn(req, res, next){
    // console.log("REQ.USER...", req.user);
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/feedback/login");
}


// app.use('/.netlify/functions/product-feedback-app-figma/app', router);

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
 })

// app.use((err, req, res, next)=>{
//     const { statusCode = 500 } = err;
//     if(!err.message) err.message = 'Something went wrong'
//     res.status(statusCode).render('error', {err})
// })

module.exports.handler = serverless(app);

app.listen(3002, () => {
    console.log('Serving on port 3002')
});