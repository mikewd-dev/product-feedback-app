const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    type: Object,
    id: Number,
    title: String,
    category: String,
    upvotes: Number,
    status: String,
    description: String,
    // replies: [
    //     {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Reply'
    //     }
    // ]
})


module.exports = mongoose.model('Request', RequestSchema);