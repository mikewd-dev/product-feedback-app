const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: Number,
    content: String,
    users:{
        image: String,
        name: String,
        username: String,
        },
          replies: [{
                    content: String,
                    replyingTo: String,
                    user: {
                        type: Object,
                        image: String,
                        name: String,
                        username: String
                    }
                }],
                rep: [{
                    content: String,
                    replyingTo: String,
                    user: {
                        type: Object,
                        image: String,
                        name: String,
                        username: String
                    }
                }]

})

module.exports = mongoose.model('Comment', CommentSchema);
