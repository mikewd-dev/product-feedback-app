const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path")
const mongoose = require("mongoose");

const ejsMate = require("ejs-mate");
const mongoimport = require("mongoimport");


const fs = require('fs');
const Request = require("./models/requests");
const Reply = require("./models/reply");
const CurrentUser = require("./models/currentUser");
const catchAsync = require("./utils/catchAsync");
const bodyParser = require('body-parser');

// fs.readFileSync(data, 'utf8', (err, jsonString) => {
//     if(err) {
//         throw err;
//     }
//     res.send(JSON.parse(jsonString).toString())
// })






mongoose
    .set("strictQuery", false)
    .connect('mongodb://127.0.0.1:27017/product-feedback')
    .then(() => {
        console.log("DATABASE CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("CONNECTION ERROR");
        console.log(err)
    });


const db = mongoose.connection;



app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

app.get('/feedback', catchAsync(async (req, res, next) => {
    res.render('feedback/index')
}));

// app.get('/roadmap', catchAsync(async(req, res, next) => {
//     res.render('roadmap')
// }));

app.get('/feedback/feedback-none', catchAsync(async (req, res, next) => {
    res.render('feedback/feedback-none')
}));

app.get('/feedback/feedback-suggestions', catchAsync(async (req, res, next) => {
     const requests = await Request.find(req.params.requests)
             res.render('feedback/feedback-suggestions', { requests })
}));

app.get('/feedback/feedback-suggestions', catchAsync(async (req, res, next) => {
     const requests = await Request.find(req.params.requests)
    fs.readFile('productRequest.json', 'utf8', (err, data)=>{
        if (err) throw err;
        if (data) {
            let json = {}
            JSON.parse(data)
             res.render('feedback/feedback-suggestions', { data:json, requests })
        }
    })


}));

app.post('/feedback', catchAsync(async (req, res, next) => {
    const request = new Request(req.body.request)
    await request.save();
    res.redirect(`/feedback/${request._id}`)
}));

//new feedback
app.get('/feedback/feedback-new', catchAsync(async (req, res, next) => {
    res.render('feedback/feedback-new')
}));

app.get('/feedback/:id', catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    res.render('feedback/feedback-show', { request })
}));

app.get('/feedback/:id/feedback-edit', catchAsync(async (req, res) => {
    const request = await Request.findById(req.params.id)
    res.render('feedback/feedback-edit', { request })
}));

app.put('/feedback/:id', catchAsync(async (req, res) => {
        const {id} = req.params;
    const request = await Request.findByIdAndUpdate(id, {...req.body.request})
    // res.redirect(`/feedback`)
    res.redirect(`/feedback/${request._id}`)
}));

app.delete('/feedback/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id)
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
app.listen(3000, () => {
    console.log('Serving on port 3000')
});