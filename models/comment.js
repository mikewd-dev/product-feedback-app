const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: Number,
    content: String,
    users:{
        image: String,
        name: String,
        username: String,
        }

})

module.exports = mongoose.model('Comment', CommentSchema);