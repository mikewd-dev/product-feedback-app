const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({

    id: Number,
    title: String,
    category: String,
    upvotes: {type:Number, default: 0},
    status:String,
    description:String,
    comments:[
            {
                id: Number,
                content: String,
            user: {
                type: Object,
                image:String,
                name:String,
                username:String,
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
                }]
        }
        ]
})

// RequestSchema.post('findOneAndUpdate', async function(doc) {
//     if (doc) {
//         await Comment.add({
//             _id: {
//                 $in: doc.comments
//             }
//         })
//     }
// })

module.exports = mongoose.model('Request', RequestSchema);

