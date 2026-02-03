const express = require("express");
const app = express();
const router = express.Router();
const sanitizeHtml = require("sanitize-html");
const serverless = require('serverless-http')
const methodOverride = require("method-override");
const flash = require("connect-flash");
const Joi = require("joi");
const path = require("path");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(() => console.log("DB Connected!!"))
  .catch((err) => console.error(err));

const ejsMate = require("ejs-mate");
const User = require("../models/user");
const Request = require("../models/request");
const Comment = require("../models/comment");
// const Reply = require("../models/reply");
const Roadmap = require("../models/roadmap");
// const bodyParser = require("body-parser");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const db = mongoose.connection;

// ========POST ROUTES==========

router.post(
  "/feedback/register",
  upload.single("image"),
  catchAsync(async (req, res) => {
    try {
      const { name, email, username, password } = req.body;

      const user = new User({ name, email, username });

      if (req.file) {
        user.image.push({
          url: req.file.path,
          filename: req.file.filename,
        });
      }

      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) {
          console.log(err);
          return res.render("feedback/register");
        }

        req.flash("success", "Registration successful");
        res.redirect("/feedback/suggestions");
        
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("register");
    }
  }),
);

router.post("/feedback/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      req.flash("error", "Unable to log you in, please check your username and/or password");
      return res.redirect("/feedback/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "Something went wrong during login.");
        return res.redirect("/feedback/login");
      }
      req.flash("success", "Welcome back!");
      return res.redirect("/feedback/suggestions");
    });
  })(req, res, next);
});

router.post(
  "/feedback",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const request = new Request(req.body.request);
    await request.save();
    req.flash("success", "Thank you for your feedback");
    res.redirect(`/feedback/${request._id}`);
  }),
);

router.post(
  "/feedback/suggestions/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Request.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();

    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/enhancement/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Request.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();
    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/bug/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Request.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();
    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/ui/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Request.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();
    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/ux/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Request.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();
    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/roadmap/:id/upvote",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const suggestion = await Roadmap.findById(req.params.id);
    suggestion.upvotes = suggestion.upvotes + 1;
    await suggestion.save();

    res.json({ upvotes: suggestion.upvotes });
  }),
);

router.post(
  "/feedback/:id/comments",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).send("Request not found");
    }

    const imageUrl = Array.isArray(req.user.image)
      ? req.user.image[0]?.url
      : req.user.image;

    const newComment = {
      content: req.body.comment.content,
      user: {
        _id: req.user._id,
        image: imageUrl,
        name: req.user.name,
        username: req.user.username,
      },
    };

    request.comments.push(newComment);
    await request.save();

    req.flash("success", "Your comment has been added successfully");
    res.redirect(`/feedback/${req.params.id}`);
  }),
);
router.post(
  "/feedback/:id/comment/:commentId/replies",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    const comment = await request.comments.id(req.params.commentId);
    const imageUrl = req.user.image[0].url;

    const newReply = {
      content: req.body.reply.content,
      replyingTo: comment.user.username,
      user: {
        _id: req.user._id,
        image: imageUrl,
        name: req.user.name,
        username: req.user.username,
      },
    };

    comment.replies.push(newReply);
    await request.save();
    req.flash("success", "Your reply was successfull");
    res.redirect(`/feedback/${request._id}`);
  }),
);

router.post(
  "/feedback/:id/comment/:commentId/reply/:replyId/replies",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    const comment = await request.comments.id(req.params.commentId);
    const reply = comment.replies.id(req.params.replyId);
    const imageUrl = req.user.image[0].url;
    const newReply = {
      content: req.body.reply.content,
      replyingTo: reply.user.username,
      user: {
        _id: req.user._id,
        name: req.user.name,
        image: imageUrl,
        username: req.user.username,
      },
    };

    comment.replies.push(newReply);
    await request.save();
    req.flash("success", "Your reply was successfull");
    console.log(newReply);
    res.redirect(`/feedback/${request._id}`);
  }),
);

// ====GET ROUTES=======

router.get(
  "/",
  catchAsync(async (req, res) => {
    let request = await Request.find({});
    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");

    res.render("feedback/index", {
      request,
      roadmap,
      progress,
      live,
      currentType: "suggestions",
    });
  }),
);

router.get("/feedback/register", (req, res) => {
  res.render("feedback/register");
});


router.get("/feedback/login", (req, res) => {
  res.render("feedback/login");
});


router.get("/feedback/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
  });
});

router.get(
  "/feedback/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("feedback/new");
  }),
);

router.get(
  "/feedback/suggestions",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({});

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");

    res.render("feedback/suggestions", {
      request,
      roadmap,
      progress,
      live,
      currentType: "suggestions",
    });
  }),
);

router.get(
  "/feedback/enhancement",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({})
      .where("category")
      .equals("Enhancement");

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!request || request.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/enhancement", {
        request,
        roadmap,
        progress,
        live,
        currentType: "enhancement",
      });
    }
  }),
);

router.get(
  "/feedback/ui",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({}).where("category").equals("UI");

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!request || request.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/ui", {
        request,
        roadmap,
        progress,
        live,
        currentType: "ui",
      });
    }
  }),
);

router.get(
  "/feedback/ux",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({}).where("category").equals("UX");

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!request || request.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/ux", {
        request,
        roadmap,
        progress,
        live,
        currentType: "ux",
      });
    }
  }),
);

router.get("/test", (req, res) => {
  console.log("User from req.user", req.user);
  res.send("Check console");
});
router.get(
  "/feedback/feature",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({}).where("category").equals("Feature");

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!request || request.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/feature", {
        request,
        roadmap,
        progress,
        live,
        currentType: "feature",
      });
    }
  }),
);

router.get(
  "/feedback/bug",
  catchAsync(async (req, res, next) => {
    let sortOrder;
    if (req.query.sort === "mostup") {
      sortOrder = (a, b) => b.upvotes - a.upvotes;
    } else if (req.query.sort === "leastup") {
      sortOrder = (a, b) => a.upvotes - b.upvotes;
    } else if (req.query.sort === "mostcomm") {
      sortOrder = "mostcomm";
    } else if (req.query.sort === "leastcomm") {
      sortOrder = "leastcomm";
    }

    let request = await Request.find({}).where("category").equals("Bug");

    if (sortOrder === "mostcomm") {
      request = request.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      request = request.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      request = request.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!request || request.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/bug", {
        request,
        roadmap,
        progress,
        live,
        currentType: "bug",
      });
    }
  }),
);

router.get(
  "/feedback/none",
  catchAsync(async (req, res, next) => {
    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    res.render("feedback/none", {
      roadmap,
      progress,
      live,
      currentType: "suggestions",
    });
  }),
);

router.get("/feedback/roadmap", async (req, res) => {
  let roadmap = await Roadmap.find({}).where("status").equals("planned");
  let progress = await Roadmap.find({}).where("status").equals("in-progress");
  let live = await Roadmap.find({}).where("status").equals("live");
  res.render("feedback/roadmap", { roadmap, progress, live });
});

router.get("/feedback/:id", isLoggedIn, async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (isLoggedIn) {
    const user = await User.findById(req.session.userId);
    res.render("feedback/show", {
      request,
      user,
    });
  } else {
    res.redirect("/login");
    
  }
});

router.get("/feedback/:id/comments", isLoggedIn, async (req, res) => {
  const request = await Request.findById(req.params.id);
  const comment = await Comment.findById(req.params.id).populate("user");
  res.render("feedback/show", { request, comment });
});

router.get("/feedback/user", isLoggedIn, async (req, res) => {
  const user = await User.find({});
  console.log(user);
  res.render("feedback/user", { user });
});

router.get("/feedback/user/:id", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render(`feedback/user/${user._id}`, { user });
});

router.get(
  "/feedback/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).render("error", { message: "Feedback not found" });
    }
    res.render("feedback/edit", { request });
  }),
);

router.get("/feedback/suggestions/:id", async (req, res) => {
  const suggestion = await Request.findById(req.params.id);
  res.json(suggestion);
});

router.get("/feedback/feature/:id", async (req, res) => {
  res.redirect("/feedback/feature");
});

router.get("/feedback/enhancement/:id", async (req, res) => {
  res.redirect("/feedback/enhancement");
});

router.get("/feedback/bug/:id", async (req, res) => {
  res.redirect("/feedback/bug");
});

router.get("/feedback/ui/:id", async (req, res) => {
  res.redirect("/feedback/ui");
});

// =====EDIT AND DELETE ROUTES========
router.put(
  "/feedback/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const request = await Request.findByIdAndUpdate(id, {
      ...req.body.request,
    });
    res.redirect(`/feedback/${request._id}`);
  }),
);

router.put("/feedback/:id/comments", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const commentData = req.body.comment;

    const comment = await Comment.findByIdAndUpdate(id, commentData, { new: true });

    res.redirect(`/feedback/comment/${comment._id}`);
  }));


router.delete(
  "/feedback/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id);
    res.redirect("/feedback/suggestions");
  }),
);

// ===============END OF ROUTES==============

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/feedback/login");
}

router.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("feedback/error", { err });
});

module.exports = router;