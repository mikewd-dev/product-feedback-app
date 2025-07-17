const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  email: String,
  name: String,
  username: {
    type: String,
    unique: true,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
