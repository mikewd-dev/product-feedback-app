const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    content: String,
    replyingTo: String,

});

module.exports = mongoose.model('Reply', ReplySchema)