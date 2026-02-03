const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const UpvoteSchema = new Schema({
    upvotes: Number
})

module.exports = mongoose.model('Upvote', UpvoteSchema);