const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({

    id: Number,
    title: String,
    category:String,
    upvotes: Number,
    status:String,
    description:String,

})


module.exports = mongoose.model('Request', RequestSchema);
