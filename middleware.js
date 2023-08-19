const { request } = require('express');
// const Request = require("./models/request");
// const Comment = require("./models/comment");
// const Reply = require('./models/reply')
// const Roadmap = require("./models/roadmap")
const ExpressError = require("./utils/ExpressError");

// module.exports.isLoggedIn = (req, res, next) =>{
//     // console.log("REQ.USER...", req.user);
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/feedback/login");
// }

// module.exports.isLoggedIn = (req, res, next) =>{
//     // console.log("REQ.USER...", req.user);
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/feedback/login");
// }
function isLoggedIn(req, res, next){
    // console.log("REQ.USER...", req.user);
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/feedback/login");
}
