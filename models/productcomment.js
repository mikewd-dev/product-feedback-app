const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ProductCommentSchema = new Schema({

            title: String,
            category: String,
            upvotes: Number,
            status: String,
            description: String,
            comments: [{
               type: Array,
                }],
    });


module.exports = mongoose.model('ProductComment', ProductCommentSchema);
