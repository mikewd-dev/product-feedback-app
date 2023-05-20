const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path")
 const { ObjectId } = require('mongodb');
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
const Reply = require('./models/reply')
const Roadmap = require("./models/roadmap")
const catchAsync = require("./utils/catchAsync");
const bodyParser = require('body-parser');



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
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
    const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
res.render('feedback/index', {roadmap, progress, live })
}));


app.get('/feedback/new', catchAsync(async (req, res) => {
    res.render('feedback/new')
}));

app.post('/feedback', catchAsync(async(req, res, next)=>{
    const request = new Request(req.body.request)
    await request.save();
    res.redirect(`/feedback/${request._id}`)
}))


// app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
//     const request = await Request.find({})
//  const roadmap  = await Roadmap.find({}).where('status').equals('planned')
// const progress = await Roadmap.find({}).where('status').equals('in-progress');
//     const live = await Roadmap.find({}).where('status').equals('live');
// res.render('feedback/suggestions', { request, roadmap, progress, live })
// }));

// app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
//   let sortOrder;
//   if (req.query.sort === 'mostup') {
//     sortOrder = { upvotes: -1 };
//   } else if (req.query.sort === 'leastup') {
//     sortOrder = { upvotes: 1 };
//   } else if (req.query.sort === 'mostcomm') {
//     sortOrder = { comments: -1 };
//   } else if (req.query.sort === 'leastcomm') {
//     sortOrder = { comments: 1 };
//   }

//   const request = await Request.find({}).sort(sortOrder);
//   const roadmap = await Roadmap.find({}).where('status').equals('planned');
//   const progress = await Roadmap.find({}).where('status').equals('in-progress');
//   const live = await Roadmap.find({}).where('status').equals('live');

//   res.render('feedback/suggestions', { request, roadmap, progress, live });

// }));

app.get('/feedback/suggestions', catchAsync(async (req, res, next) => {
  let sortOrder;
  if (req.query.sort === 'mostup') {
    sortOrder = { upvotes: -1 };
  } else if (req.query.sort === 'leastup') {
    sortOrder = { upvotes: 1 };
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
    request = request.sort(sortOrder);
  }

  const roadmap = await Roadmap.find({}).where('status').equals('planned');
  const progress = await Roadmap.find({}).where('status').equals('in-progress');
  const live = await Roadmap.find({}).where('status').equals('live');

  res.render('feedback/suggestions', { request, roadmap, progress, live });
}));





// function sortMostUpvotes() {
//   let mostUpvotesbtn = document.getElementById('mostup')
//   mostUpvotesbtn.addEventListener('click', ()=>{
//     Request.find({}).sort({upvotes:1})
//   })
// }


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






app.put('/feedback/:id', catchAsync(async (req, res) => {
        const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    res.redirect(`/feedback/${request._id}`)
}));


app.get('/feedback/ui', catchAsync(async(req, res, next) =>{
   const request = await Request.find({}).where('category').equals('ui')
 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/ui', {request, roadmap, progress, live})
    }
}))

app.get('/feedback/ux', catchAsync(async(req, res, next) =>{
    const request = await Request.find({}).where('category').equals('ux')
 const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/ux', {request, roadmap, progress, live})
    }
}))

app.get('/feedback/bug', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('Bug')
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/bug', {request, roadmap, progress, live})
    }
}))

app.get('/feedback/enhancement', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('enhancement')
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
    // console.log(request)
     if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/enhancement', {request, roadmap, progress, live})
    }
}))

app.get('/feedback/feature', catchAsync(async(req, res, next) =>{
    const request = await Request.find().where('category').equals('feature')
     const roadmap  = await Roadmap.find({}).where('status').equals('planned')
const progress = await Roadmap.find({}).where('status').equals('in-progress');
    const live = await Roadmap.find({}).where('status').equals('live');
res.render('feedback/suggestions', { request, roadmap, progress, live })
    if(request == "" || null){
        res.redirect('/feedback/none')
    } else {
        res.render('feedback/feature', {request, roadmap, progress, live})
    }
}))

// app.get('/feedback/roadmap', catchAsync(async(req, res)=>{
// const roadmap = Roadmap.find({})
// res.render('feedback/roadmap', {roadmap})
// }))



app.get('/feedback/:id', async (req, res) => {
    // const comment = await Comment.findById(req.params.id)
    const request = await Request.findById(req.params.id).populate('comments')
        .populate('comments.replies')
    res.render('feedback/show', {request})
});

app.get('/feedback/:id/comments', async(req, res)=>{
    const request = await Request.findById(req.params.id)

    const comment = await Comment.findById(req.params.id)
    res.render('feedback/show', {request, comment})
})

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





app.post('/feedback/suggestions/:id/upvote', async (req, res) => {
  const suggestion = await Request.findById(req.params.id);

  // Update the upvotes value in your database
  suggestion.upvotes = suggestion.upvotes + 1;
  await suggestion.save();

  res.json({ upvotes: suggestion.upvotes });
});

app.get('/feedback/suggestions/:id', async(req, res) => {
  // Return the suggestion object as JSON
  const suggestion = await Request.findById(req.params.id);
  res.json(suggestion);
});


app.get('/feedback/feature/:id', async(req, res)=>{
    // const request = await Request.findById(req.params.id)
    res.redirect('/feedback/feature')
})

// app.post('/feedback/feature/:id/upvote', async (req, res) => {
// //   const request = req.params.request;
//   const suggestion = await Request.findById(req.params.id);

//   // Update the upvotes value in your database
//   suggestion.upvotes = suggestion.upvotes + 1;
//   await suggestion.save();

//   res.json({ upvotes: suggestion.upvotes});
// });

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
    comment.save().then(()=>{
        request.comments.push(comment);
        request.save();
        res.redirect(`/feedback/${request._id}`)
    })
})

app.post('/feedback/:id/comment/:commentId/replies', async (req, res) => {
  const request = await Request.findById(req.params.id);
  const comment = await request.comments.id(req.params.commentId);
  const reply = new Reply(req.body.reply);
  comment.replies.push(reply);
  await request.save();

  res.redirect(`/feedback/${request._id}`);
});

// app.post('/feedback/:id/comment/:commentId/replies', async (req, res) => {
//   const request = await Request.findOne({_id: req.params.id});
// const comment = request.comments.find(c => c.id === 4);
// const reply = {
//   content: "Your reply content",
//   user: {
//     image: "user-image-url",
//     name: "John Doe",
//     username: "johndoe"
//   }
// };
// comment.replies.push(reply);
// await request.save();
// });








// app.post('/feedback/:id/comment/:commentId?/replies/:replyId?', async (req, res) => {
//   const requestId = req.params.id;
//   const commentId = req.params.commentId;
//   const replyId = req.params.replyId;

//   const request = await Request.findById(requestId);
//   const comment = request.comments.id(commentId);

// //   let reply;

//   // If a reply ID is provided, update the existing reply
//   if (replyId) {
//     // reply = comment.replies.id(replyId);
//     req.body.reply.content;
//   }
//   // Otherwise, create a new reply
//   else {
//     const parentReplyId = req.body.reply.replyingTo;
//     const parentReply = comment.replies.id(parentReplyId);
//     const reply = new Reply(req.body.reply);
//     parentReply.replies.push(reply);
//   }

//   await request.save();
//   console.log(reply)
//   res.redirect(`/feedback/${requestId}`);
// });




// app.post('/feedback/:id/comment/:commentId/replies/:replyId', async (req, res) => {
//   const request = await Request.findById(req.params.id);
//   const comment = await request.comments.id(req.params.commentId);
//   const reply = new Reply(req.body.reply);
//   comment.replies.push(reply);
//   await request.save();

//   res.redirect(`/feedback/${request._id}`);
// });

// app.post('/feedback/:id/comment/:commentId/replies/:replyId', async(req, res)=>{
//     const request = await Request.findById(req.params.id)
//     const comment = await request.comments.id(req.params.commentId);
//     const reply = await comment.replies.id(req.params.replyId)
//     const repl  = new Reply(req.body.reply)
//     reply.repls.push(repl)
//     await request.save();

//     res.redirect(`/feedback/${request._id}`);

// })






app.listen(3000, () => {
    console.log('Serving on port 3000')
});