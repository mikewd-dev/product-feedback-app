const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: Number,
    content: String,
    user:{
        type: Object,
        image: [
    {
      url: String,
      filename: String
    }
  ],
        name: String,
        username: String,
        },
          replies: [{
                    content: String,
                    replyingTo: String,
                    user: {
                type: Object,
                image: [
    {
      url: String,
      filename: String
    }
  ],
                name:String,
                username:String,
            },
                }]

})

module.exports = mongoose.model('Comment', CommentSchema);