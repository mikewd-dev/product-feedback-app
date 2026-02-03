const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({

    title: String,
    category: String,
    description: String,

})


module.exports = mongoose.model('Feedback', FeedbackSchema);