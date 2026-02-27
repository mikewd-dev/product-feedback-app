const express = require("express");
const app = express();
const router = express.Router();
const sanitizeHtml = require("sanitize-html");
const serverless = require('serverless-http');
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


const ejsMate = require("ejs-mate");
const User = require("../models/user");
const Request = require("../models/request");
const Comment = require("../models/comment");
const Roadmap = require("../models/roadmap");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const comment = require("../models/comment");
const { isLoggedIn, currentUser } = require("../middleware");
const { isUint8Array } = require("util/types");
const { isArray } = require("util");
const db = mongoose.connection;


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
       console.log("LOGIN FAILED IN TEST. Reason:", info.message); 
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

router.post("/feedback/logout", (req, res, nrxt) => {
  req.logout (function (err) {
    if (err) {
      return next (err);
      return res.redirect("/feedback/login");
    }
  })
})

router.post(
  "/feedback",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const allRequest = new Request(req.body.request);
    allRequest.author = req.user._id
    await allRequest.save();
    req.flash("success", "Thank you for your feedback");
    res.redirect(`/feedback/${allRequest._id}`);
  }),
);



router.post("/feedback/:id/upvote", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    

    let doc = await Request.findById(id) || await Roadmap.findById(id);

    if (!doc) {
        return res.status(404).json({ error: "Not found" });
    }

    doc.upvotes += 1;
    await doc.save();
    res.json({ upvotes: doc.upvotes });
}));

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



router.get(
  "/",
  catchAsync(async (req, res) => {
    let allRequest = await Request.find({});
    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");

    res.render("feedback/index", {
      request: allRequest,
      roadmap,
      progress,
      live,
      currentType: "suggestions",
    });
  }),
);

router.get("/feedback/register", (req, res) => {
  res.render("feedback/register");
  if (req.isAuthenticated()) {
    res.redirect("/feedback");
  }
});


router.get("/feedback/login", (req, res) => {
  res.render("feedback/login");
});

router.get('/feedback/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Clear the specific session cookie
            res.redirect('/feedback/login');
        });
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
  "/feedback/suggestions", isLoggedIn,
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

    let allRequest = await Request.find({});

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");

    res.render("feedback/suggestions", {
      request: allRequest,
      roadmap,
      progress,
      live,
      currentType: "suggestions",
    });
  }),
);

router.get(
  "/feedback/enhancement", isLoggedIn,
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

    let allRequest = await Request.find({})
      .where("category")
      .equals("enhancement");

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!allRequest || allRequest.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/enhancement", {
        request: allRequest,
        roadmap,
        progress,
        live,
        currentType: "enhancement",
      });
    }
  }),
);

router.get(
  "/feedback/ui", isLoggedIn,
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

    let allRequest = await Request.find({}).where("category").equals("ui");

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!allRequest || allRequest.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/ui", {
        request: allRequest,
        roadmap,
        progress,
        live,
        currentType: "ui",
      });
    }
  }),
);

router.get(
  "/feedback/ux", isLoggedIn,
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

    let allRequest = await Request.find({}).where("category").equals("UX");

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!allRequest || allRequest.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/ux", {
        request: allRequest,
        roadmap,
        progress,
        live,
        currentType: "UX",
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

    let allRequest = await Request.find({}).where("category").equals("feature");

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!allRequest || allRequest.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/feature", {
        request: allRequest,
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

    let allRequest = await Request.find({}).where("category").equals("bug");

    if (sortOrder === "mostcomm") {
      allRequest = allRequest.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortOrder === "leastcomm") {
      allRequest = allRequest.sort((a, b) => a.comments.length - b.comments.length);
    } else {
      allRequest = allRequest.sort(sortOrder || ((a, b) => 0));
    }

    const roadmap = await Roadmap.find({}).where("status").equals("planned");
    const progress = await Roadmap.find({})
      .where("status")
      .equals("in-progress");
    const live = await Roadmap.find({}).where("status").equals("live");
    if (!allRequest || allRequest.length === 0) {
      res.redirect("/feedback/none");
    } else {
      res.render("feedback/bug", {
        request: allRequest,
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



router.get("/feedback/:id/comments", isLoggedIn, async (req, res) => {
  const allRequest = await Request.findById(req.params.id);
  const comment = await Comment.findById(req.params.id).populate("user");
  res.render("feedback/show", { allRequest, comment });
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
    const allRequest = await Request.findById(req.params.id);
    if (!allRequest) {
      return res.status(404).render("error", { message: "Feedback not found" });
    }
    res.render("feedback/edit", { allRequest });
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

router.get("/feedback/:id([0-9a-fA-F]{24})", isLoggedIn, async (req, res) => {
  const allRequest = await Request.findById(req.params.id);

  res.render("feedback/show", {
    request: allRequest,
    user: req.user, 
  });
});


router.put(
  "/feedback/:id/",
  isLoggedIn, currentUser,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const allRequest = await Request.findByIdAndUpdate(id, {
      ...req.body.request,
    });
    res.redirect(`/feedback/${allRequest._id}`);
  }),
);

router.put("/feedback/:id/comments", isLoggedIn, currentUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    const commentData = req.body.comment;

    const comment = await Comment.findByIdAndUpdate(id, commentData, { new: true });

    res.redirect(`/feedback/comment/${comment._id}`);
  }));


router.delete(
  "/feedback/:id",
  isLoggedIn, currentUser,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const allRequest = await Request.findByIdAndDelete(id);
    res.redirect("/feedback/suggestions");
  }),
);





module.exports = router;