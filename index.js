const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path")
const fetch = require('fetch')
const mongoose = require("mongoose");
// const addNewCount = require("./public/javascript/javascript")
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI,
    { useUnifiedTopology: true})
    .then(()=> console.log('DB Connected!!'))
    .catch(err=> console.error(err))

const ejsMate = require("ejs-mate");
const CurrentUser = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Upvote = require("./models/upvotes")
const Roadmap = require("./models/roadmap")
const User = require("./models/user")
const catchAsync = require("./utils/catchAsync");
const bodyParser = require('body-parser');
const upvotes = require("./models/upvotes");


const db = mongoose.connection;

app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.json())

// app.use(express.json())

app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

app.get('/feedback', catchAsync(async (req, res, next) => {
    res.render('feedback/index')
}));

app.get('/feedback/new', catchAsync(async (req, res) => {
    res.render('feedback/new')
}));

app.post('/feedback', catchAsync(async(req, res, next)=>{
    const request = new Request(req.body.request)
    await request.save();
    res.redirect(`/feedback/${request._id}`)
}))

app.get('/feedback/none', catchAsync(async (req, res, next) => {
    res.render('feedback/none')
}));

app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
const request = await Request.find({})
res.render('feedback/suggestions', { request })
}));


app.put('/feedback/:id', catchAsync(async (req, res) => {
        const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    res.redirect(`/feedback/${request._id}`)
}));


app.get('/feedback/ui', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('UI')
    // console.log(request)
    if(request == "" || null){
        res.redirect('/feedback')
    } else {
        res.render('feedback/ux', {request})
    }
    res.render('feedback/ui', {request})
}))

app.get('/feedback/ux', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('UX')

    if(request == "" || null){
        res.redirect('/feedback')
    } else {
        res.render('feedback/ux', {request})
    }
}))

app.get('/feedback/bug', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('Bug')
    // console.log(request)
    if(request == "" || null){
        res.redirect('/feedback')
    } else {
        res.render('feedback/bug', {request})
    }
}))

app.get('/feedback/enhancement', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('enhancement')
    // console.log(request)
     if(request == "" || null){
        res.redirect('/feedback')
    } else {
        res.render('feedback/enhancement', {request})
    }
}))

app.get('/feedback/feature', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('feature')
    // console.log(request)
    res.render('feedback/feature', {request})
}))

app.get('/feedback/roadmap', catchAsync(async(req, res)=>{
const roadmap = Roadmap.find({})
res.render('feedback/roadmap', {roadmap})
}))

app.get('/feedback/:id', async (req, res) => {
    // const comment = await Comment.findById(req.params.id)
    const request = await Request.findById(req.params.id).populate('comments')
                    .populate('comments.user')
                    .populate('comments.replies')
    res.render('feedback/show', {request})


});

app.get('/feedback/user', async(req, res)=>{
    const currentuser = await CurrentUser.find({})
    console.log(currentuser);
    res.render('feedback/user', { currentuser })
})

app.get('/feedback/user/:id', async(req, res) =>{
    const currentuser = await CurrentUser.findById(req.params.id);
    res.render(`feedback/user/${user._id}`, { currentuser })
})

app.get('/feedback/:id/edit', catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id)
    res.render('feedback/edit', { request })
}));

app.put('/feedback/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    res.redirect(`/feedback/${request._id}`)
}));

app.get('/feedback/suggestions/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/suggestions')
})

app.post('/feedback/suggestions/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});

app.get('/feedback/feature/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/feature')
})

app.post('/feedback/feature/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});

app.get('/feedback/enhancement/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/enhancement')
})

app.post('/feedback/enhancement/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});

app.get('/feedback/bug/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/bug')
})

app.post('/feedback/bug/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});

app.get('/feedback/ui/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/ui')
})

app.post('/feedback/ui/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});
app.get('/feedback/ux/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/ux')
})

app.post('/feedback/ux/:id/upvote', async (req, res) => {
//   const request = req.params.request;
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes});
});

app.delete('/feedback/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id)
    res.redirect('/feedback');
}));


app.post('/feedback/:id/comments', async(req, res) =>{
    const request = await Request.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    request.comments.push(comment);
    await request.save();
    await comment.save();
    res.redirect(`/feedback/${request._id}`)
})




app.listen(3000, () => {
    console.log('Serving on port 3000')
});