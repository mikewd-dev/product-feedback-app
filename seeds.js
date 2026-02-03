const express = require("express");
const app = express();
const mongoose = require('mongoose')
const fs = require('fs');
const Feedback = require('./models/feedback')


const config = {
fields: [],
db: 'feedback',
collection: 'feedbacks',

host: '127.0.0.1:27017',
username: '',
password: '',
callback: (err, db) => {}
};

const mi = require('mongoimport')
mi(config)



// Feedback.remove({})



Feedback.deleteMany(config)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})


