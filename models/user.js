const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    image: String,
    name: String,
    username: String,
});


module.exports = mongoose.model('User', UserSchema)