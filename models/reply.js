const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema([{

        id: Number,
        content: String,
        user:{
            image: String,
            name: String,
            username: String,
        },
        replies: {
            content: String,
            replyingTo: String,
            user: {
                image: String,
                name: String,
                username: String,
            }
        }

}])

module.exports = mongoose.model('Reply', ReplySchema);
