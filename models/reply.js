const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  content: {
    type: String,
    required: true
  },
  replyingTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Reply', ReplySchema)