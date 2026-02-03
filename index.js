const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const data = require('./data.json');
const fs = require('fs');
const Feedback = require("./models/feedback");
const catchAsync = require("./utils/catchAsync");

// fs.readFileSync(data, 'utf8', (err, jsonString) => {
//     if(err) {
//         throw err;
//     }
//     res.send(JSON.parse(jsonString).toString())
// })




mongoose
.connect('mongodb://127.0.0.1:27017/feedback')
.then(()=>{
    console.log("DATABASE CONNECTION OPEN");
})
.catch((err)=>{
    console.log("CONNECTION ERROR");
    console.log(err)
});
// mongoose.set("strictQuery", false);
// mongoose.connect('mongodb://localhost:27017/feedback'), () => {
//   console.log("Connected to MongoDB");
// };

const db = mongoose.connection;



app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

app.get('/feedback', catchAsync(async(req, res, next)=>{
    res.render('feedback/index')
}));

app.get('/roadmap', catchAsync(async(req, res, next) => {
    res.render('roadmap')
}));

app.get('/feedback/feedback-none', catchAsync(async(req, res, next)=>{
    res.render('feedback/feedback-none')
}));

app.get('/feedback/feedback-suggestions', catchAsync(async(req, res, next) => {
    const feedbacks = await Feedback.find(req.params.feedback)
    res.render('feedback/feedback-suggestions', { feedbacks })
}));






app.post('/feedback', catchAsync(async(req, res, next)=>{
    const feedback = new Feedback(req.body.feedback)
    await feedback.save();

    res.redirect(`/feedback/${feedback._id}`)

}));

 //new feedback
app.get('/feedback/feedback-new', catchAsync(async(req, res, next)=>{
    res.render('feedback/feedback-new')
}));

app.get('/feedback/:id', catchAsync(async(req, res) =>{
    const feedback = await Feedback.findById(req.params.id)
    res.render('feedback/feedback-show', { feedback })
}));

app.get('/feedback/:id/feedback-edit', catchAsync(async(req, res, next) =>{
    const feedback = await Feedback.findById(req.params.id)
    res.render('feedback/feedback-edit', { feedback })
}));

app.put('/feedback/:id', catchAsync(async(req, res)=>{

    const { id } = req.params;
    const feedback = await Feedback.findByIdAndUpdate(id, { ...req.body.feedback })

    res.redirect(`/feedback/${feedback._id}`)
}));



app.delete('/feedback/:id', catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const feedback = await Feedback.findByIdAndDelete(id)
    res.redirect('/feedback');
}));

// app.get('/feedback/feedback-all', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("All feedback here")
// })

// app.get('/feedback/feedback-ui', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("UI Feedback here")
// })

// app.get('/feedback/feedback-ux', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("UX feedback here")
// })

// app.get('/feedback/feedback-enhancement', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Enhancement feedback here");
// })

// app.get('/feedback/feedback-bug', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Bug feedback here")
// })

// app.get('/feedback/feedback-feature', (req, res) => {
//     const feedback = Feedback.find({});
//     console.log(feedback);
//     res.send("Feature feedback here")
// })
app.listen(3000, () =>{
    console.log('Serving on port 3000')
});