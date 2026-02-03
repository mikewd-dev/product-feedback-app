const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserCommentSchema = new Schema({
    image: String,
    name: String,
    username: String
});

module.exports = mongoose.model('UserComment', UserCommentSchema)