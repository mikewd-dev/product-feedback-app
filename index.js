if (process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
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
const User = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require('./models/reply')
const Roadmap = require("./models/roadmap")
const catchAsync = require("./utils/catchAsync");
const bodyParser = require('body-parser');
const ExpressError = require('./utils/ExpressError');

const db = mongoose.connection;

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


// app.use((req, res, next) => {
//     // console.log(req.session)
//     res.locals.user = req.user;
//     res.locals.messages = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

// ========POST ROUTES==========


// app.post("/feedback/register", upload.single('image'), async (req, res) => {
//     try {
//         const { name, email, username, password } = req.body;

//         // Create a new User instance
//         const user = new User({ name, email, username });

//         // Check if a file was uploaded and set the image property accordingly
//         if (req.file) {
//             user.image.push({
//                 url: req.file.path, // Store the Cloudinary URL here
//                 filename: req.file.filename // Store the Cloudinary filename here
//             });
//         }

//         // Register the user using passport-local-mongoose
//         const registeredUser = await User.register(user, password);

//         req.login(registeredUser, err => {
//             if (err) {
//                 console.log(err);
//                 return res.render("feedback/register");
//             }

//             res.redirect("/feedback");
//             req.flash('Success', 'Registration successfull')
//         });
//     } catch (e) {
//         console.log(e); // Log the error for debugging
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// });

app.post("/feedback/register", upload.single('image'), catchAsync(async (req, res) => {
    try {
        const registerSchema = Joi.object({
            // register: Joi.object({
                email: Joi.string().required(),
                name: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
                // image: Joi.any().required()
            // }).required()
        });
        const { error } = registerSchema.validate(req.body);

        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        }

        const { name, email, username, password } = req.body;

        // Create a new User instance
        const user = new User({ name, email, username });

        // Check if a file was uploaded and set the image property accordingly
        if (req.file) {
            user.image.push({
                url: req.file.path, // Store the Cloudinary URL here
                filename: req.file.filename // Store the Cloudinary filename here
            });
        }

        // Register the user using passport-local-mongoose
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) {
                console.log(err);
                return res.render("feedback/register");
            }

            res.redirect("/feedback");
            req.flash('success', 'Registration successful'); // "success" instead of "Success"
        });
    } catch (e) {
        console.log(e); // Log the error for debugging
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

app.post("/feedback/login", passport.authenticate("local",
    {
        successRedirect: "/feedback/suggestions",
        failureRedirect: "/feedback/login"
    }), (req, res)=> {
        req.flash('success', 'Welcome Back!')
})

app.post('/feedback', isLoggedIn, catchAsync(async(req, res)=>{
    const request = new Request(req.body.request)
    await request.save();
    req.flash('success', 'Thank you for your feedback')
    res.redirect(`/feedback/${request._id}`)
}))

app.post('/feedback/suggestions/:id/upvote', async (req, res) => {
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes });
});

app.post('/feedback/enhancement/:id/upvote', isLoggedIn, catchAsync(async (req, res) => {
  const suggestion = await Request.findById(req.params.id);
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();
  res.json({ upvotes: suggestion.upvotes});
}));

app.post('/feedback/bug/:id/upvote', async (req, res) => {
  const suggestion = await Request.findById(req.params.id);
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();
  res.json({ upvotes: suggestion.upvotes});
});

app.post('/feedback/ui/:id/upvote', async (req, res) => {
  const suggestion = await Request.findById(req.params.id);
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();
  res.json({ upvotes: suggestion.upvotes});
});
app.get('/feedback/ux/:id', async(req, res)=>{
    res.redirect('/feedback/ux')
})

app.post('/feedback/ux/:id/upvote', isLoggedIn, async (req, res) => {
  const suggestion = await Request.findById(req.params.id);
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();
  res.json({ upvotes: suggestion.upvotes});
});

app.post('/feedback/:id/comments', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).send('Request not found');
    }
    const imageUrl = req.user.image[0].url;
    const newComment = {
      content: req.body.comment.content,
      user: {
        _id: req.user._id,
        image: imageUrl,
        name: req.user.name,
        username: req.user.username
      }
    };

    request.comments.push(newComment);
    await request.save();
req.flash('success', 'Your comment has been added successfully')
    res.redirect(`/feedback/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/feedback/:id/comment/:commentId/replies', isLoggedIn, async (req, res) => {
  const request = await Request.findById(req.params.id);
  const comment = await request.comments.id(req.params.commentId);
   const imageUrl = req.user.image[0].url;

//   let reply = req.user.username;
   const newReply = {
      content: req.body.reply.content,
      replyingTo: comment.user.username,
      user: {
        _id: req.user._id,
        image: imageUrl,
        name: req.user.name,
        username: req.user.username
      }
    };

  comment.replies.push(newReply);
  await request.save();
  req.flash('success', 'Your reply was successfull')
  res.redirect(`/feedback/${request._id}`);
});

app.post('/feedback/:id/comment/:commentId/reply/:replyId/replies', isLoggedIn, async (req, res) => {
  const request = await Request.findById(req.params.id);
  const comment = await request.comments.id(req.params.commentId);
  const reply = comment.replies.id(req.params.replyId);
   const imageUrl = req.user.image[0].url;
  const newReply = {
    content: req.body.reply.content,
    replyingTo: reply.user.username, // Use the username of the user being replied to
    user: {
      _id: req.user._id,
      name: req.user.name,
      image: imageUrl,
      username: req.user.username
    }
  };

  comment.replies.push(newReply);
  await request.save();
  req.flash('success', 'Your reply was successfull')
  console.log(newReply);
  res.redirect(`/feedback/${request._id}`);
});


// app.post('/feedback/:id/comment/:commentId/reply/:replyId/rep', isLoggedIn, async (req, res) => {
//   const request = await Request.findById(req.params.id);
//   const comment = await request.comments.id(req.params.commentId);
//   const reply = await comment.replies.id(req.params.replyId);
//    const newRep = {
//       content: req.body.reply.content,
//       user: {
//         _id: req.user._id,
//         //image: req.user.image,
//         name: req.user.name,
//         username: req.user.username
//       }
//     };
//   reply.replies.push(newRep);
//   await request.save();
//   res.redirect(`/feedback/${request._id}`);
// });


// ====GET ROUTES=======

app.get('/feedback', catchAsync(async (req, res) => {
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
    const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
res.render('feedback/index', {roadmap, progress, live })

}));

app.get('/feedback/register', (req, res)=>{
    res.render('feedback/register')
});

app.get("/feedback/login", (req, res)=>{
    res.render('feedback/login')
})

app.get("/feedback/logout", (req, res)=>{
    req.logout;
    res.redirect('/feedback/login')
})



app.get('/feedback/new', isLoggedIn, catchAsync(async (req, res) => {

    res.render('feedback/new')
}));



app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({});

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}


  const roadmap = await Roadmap.find({}).where('status').equals('planned');
  const progress = await Roadmap.find({}).where('status').equals('in-progress');
  const live = await Roadmap.find({}).where('status').equals('live');

  res.render('feedback/suggestions', { request, roadmap, progress, live });
}));

app.get('/feedback/enhancement', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({}).where('category').equals('enhancement');

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}


   const roadmap  = await Roadmap.find({}).where('status').equals('planned')
   const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/enhancement', {request, roadmap, progress, live})
    }
}));

app.get('/feedback/ui', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({}).where('category').equals('UI');

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}

 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/ui', {request, roadmap, progress, live})
    }
}));

app.get('/feedback/ux', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({}).where('category').equals('UX');

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}

 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/ux', {request, roadmap, progress, live})
    }
}));

app.get('/feedback/feature', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({}).where('category').equals('feature');

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}

 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/feature', {request, roadmap, progress, live})
    }
}));

app.get('/feedback/bug', catchAsync(async (req, res, next) => {
  let sortOrder;
if (req.query.sort === 'mostup') {
  sortOrder = (a, b) => b.upvotes - a.upvotes;
} else if (req.query.sort === 'leastup') {
  sortOrder = (a, b) => a.upvotes - b.upvotes;
} else if (req.query.sort === 'mostcomm') {
  sortOrder = 'mostcomm';
} else if (req.query.sort === 'leastcomm') {
  sortOrder = 'leastcomm';
}

  let request = await Request.find({}).where('category').equals('bug');

  if (sortOrder === 'mostcomm') {
  request = request.sort((a, b) => b.comments.length - a.comments.length);
} else if (sortOrder === 'leastcomm') {
  request = request.sort((a, b) => a.comments.length - b.comments.length);
} else {
  // Default sort order when sortOrder is undefined or has an invalid value
  request = request.sort(sortOrder || ((a, b) => 0));
}

 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/bug', {request, roadmap, progress, live})
    }
}));

app.get('/feedback/none', catchAsync(async (req, res, next) => {
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
res.render('feedback/none', {roadmap, progress, live })
}));

app.get('/feedback/roadmap', async(req, res)=>{
    let roadmap  = await Roadmap.find({}).where('status').equals('planned')
    let progress = await Roadmap.find({}).where('status').equals('in-progress');
    let live = await Roadmap.find({}).where('status').equals('live');
    res.render('feedback/roadmap', { roadmap, progress, live })
});

app.get('/feedback/:id', isLoggedIn, async(req, res) => {
  const request = await Request.findById(req.params.id);
  if (isLoggedIn) {
    const user = await User.findById(req.session.userId);
    res.render('feedback/show', {
      request,
      user,
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/feedback/:id/comments', isLoggedIn, async(req, res)=>{
    const request = await Request.findById(req.params.id)
    const comment = await Comment.findById(req.params.id).populate('user')
    res.render('feedback/show', {request, comment})
})

app.get('/feedback/user', isLoggedIn, async(req, res)=>{
    const user = await User.find({})
    console.log(user);
    res.render('feedback/user', { user })
})

app.get('/feedback/user/:id', isLoggedIn, async(req, res) =>{
    const user = await User.findById(req.params.id);
    res.render(`feedback/user/${user._id}`, { user })
})

app.get('/feedback/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id)
    res.render('feedback/edit', { request })
}));

app.get('/feedback/suggestions/:id', async(req, res) => {
  // Return the suggestion object as JSON
  const suggestion = await Request.findById(req.params.id);
  res.json(suggestion);
});

app.get('/feedback/feature/:id', async(req, res)=>{
    res.redirect('/feedback/feature')
})

app.get('/feedback/enhancement/:id', async(req, res)=>{
    res.redirect('/feedback/enhancement')
})

app.get('/feedback/bug/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/bug')
})

app.get('/feedback/ui/:id', async(req, res)=>{
    res.redirect('/feedback/ui')
})

// =====EDIT AND DELETE ROUTES========
app.put('/feedback/:id', isLoggedIn, catchAsync(async (req, res) => {
        const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    res.redirect(`/feedback/${request._id}`)
}));

app.delete('/feedback/:id',isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id)
    res.redirect('/feedback');
}));

// ===============END OF ROUTES==============

function isLoggedIn(req, res, next){
    // console.log("REQ.USER...", req.user);
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/feedback/login");
}

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
});