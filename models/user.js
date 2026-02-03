const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrentUserSchema = new Schema({

    image: String,
    name: String,
    username: String,
    Requests:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Request'
        }
    ]
});


module.exports = mongoose.model('CurrentUser', CurrentUserSchema)