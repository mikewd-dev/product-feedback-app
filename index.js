const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path")
const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true})
    .then(()=> console.log('DB Connected!!'))
    .catch(err=> console.error(err))



const ejsMate = require("ejs-mate");
// const mongoimport = require("mongoimport");


// const fs = require('fs');
const CurrentUser = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const ProductComment = require("./models/productcomment")
const User = require("./models/user")
// const Data = require('./models/data')
const catchAsync = require("./utils/catchAsync");
const bodyParser = require('body-parser');


const db = mongoose.connection;

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

// app.get('/currentuser', async(req, res)=>{
//     const currentUser = await CurrentUser(req.params.id)
//     res.render('currentuser/', { currentUser })
// })



app.get('/feedback', catchAsync(async (req, res, next) => {
    res.render('feedback/index')
}));



app.get('/feedback/none', catchAsync(async (req, res, next) => {
    res.render('feedback/none')
}));


// app.post('/currentuser/:id/requests', async(req, res)=>{
//     const currentuser = await CurrentUser.findById(req.params.id);
//     const request = new Request(req.body.request)
// })



app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
const request = await Request.find({})
console.log(request)
res.render('feedback/suggestions', { request })
}));

// app.get('/feedback/:id/comment', async(req, res) =>{
//     const comment = await Comment.find({});
//     console.log(comment)
//     res.render('feedback/show', { comment })
// })


app.post('/feedback', catchAsync(async (req, res, next) => {
    const request = new Request(req.body.request)
    console.log(request)
    await request.save();
    res.redirect(`/feedback/${request._id}`)
}));

// app.post('feedback/:id/')

app.get('/feedback/:id', async (req, res) => {
    const request = await Request.findById(req.params.id).populate('comments')
    res.render('feedback/show', { request })
});



app.get('/feedback/new', catchAsync(async (req, res, next) => {
    res.render('feedback/new')
}));

app.get('/feedback/user', async(req, res)=>{
    const currentuser = await CurrentUser.find({})
    console.log(currentuser);
    res.render('feedback/user', { currentuser })
})

app.get('/feedback/user/:id', async(req, res) =>{
    const currentuser = await CurrentUser.findById(req.params.id);
    res.render(`feedback/user/${user._id}`, { currentuser })
})

// app.get('/feedback/show', async(req, res) => {
//     const request = await Request.find({})

//     res.render('feedback/show', { request })
// })






// app.get('/feedback/:id/comments', async (req, res) =>{
// const comment = await Comment.find({})
// console.log(comment)
// res.render('/feedback/show', { comment })
// });




app.get('/feedback/:id/edit', catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id)
    res.render('feedback/edit', { request })
}));

app.put('/feedback/:id', catchAsync(async (req, res) => {
        const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    res.redirect(`/feedback/${request._id}`)
}));

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




// app.get('/feedback/all', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("All feedback here")
// })

// app.get('/feedback/ui', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("UI Feedback here")
// })

// app.get('/feedback/ux', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("UX feedback here")
// })

// app.get('/feedback/enhancement', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Enhancement feedback here");
// })

// app.get('/feedback/bug', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Bug feedback here")
// })

// app.get('/feedback/feature', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Feature feedback here")
// })
app.listen(3000, () => {
    console.log('Serving on port 3000')
});