const { request } = require('express');
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require('./models/reply')
const Roadmap = require("./models/roadmap")
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    req.session.returnTo = (req.query._method === 'DELETE' ? `/feedback/${id}` : req.originalUrl);
    // req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// module.exports.validateRequest = (req, res, next) => {
//     const { error } = requestSchema.validate(req.body)
//     if(error){
//         //map over error.details and turn into a string
//         const msg  = error.details.map(el => el.message).join(', ')
//         throw new ExpressError(msg, 400)
//         //result.error.details is an array
//     } else {
//         next();
//     }
// }

module.exports.isCommentAuthor = async(req, res, next) =>{
    const { id, commentId } = req.params
    const comment = await Comment.findById(commentId);
    if(!comment.user.equals(req.user.id)) {
         alert("You are not authorised");
        return res.redirect(`/feedback/${id}`)
    }
    next()
}