const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrentUserSchema = new Schema({

    image: String,
    name: String,
    username: String,

})


module.exports = mongoose.model('currentUser', CurrentUserSchema);