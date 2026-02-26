const { request } = require("express");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require("./models/reply");
const Roadmap = require("./models/roadmap");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/feedback/login");
}


const currentUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const feedback = await Request.findById(id);

  if (!feedback) {
    req.flash("error", "Cannot find that feedback!");
    return res.redirect("/feedback/suggestions");
  }

  if (!feedback.author) {
    req.flash("error", "This post has no author assigned.");
    return res.redirect(`/feedback/${id}`);
  }

  if (!feedback.author.equals(req.user._id)) {
    req.flash("error", "You are not authorised to do that!");
    return res.redirect(`/feedback/${feedback._id}`);
  }

  next();
});



module.exports = { isLoggedIn, currentUser };