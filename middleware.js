const { request } = require('express');
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require('./models/reply')
const Roadmap = require("./models/roadmap")
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


// module.exports.isLoggedIn = (req, res, next) => {
//   const { id } = req.params;
//   if (!req.isAuthenticated()) {
//     req.session.returnTo = (req.query._method === 'DELETE' ? `/feedback/${id}` : req.originalUrl);
//     req.flash("error", "You must be signed in first!");
//     return res.redirect("/feedback/login");
//   }
//   next();
// };


// module.exports.isLoggedIn = (req, res, next){
//     // console.log("REQ.USER...", req.user);
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/feedback/login");
// }

// app.listen(3000, () => {
//     console.log('Serving on port 3000')
// });

// function isLoggedIn(req, res, next){
//     // console.log("REQ.USER...", req.user);
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/feedback/login");
// }
