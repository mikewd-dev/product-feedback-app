const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplyingToSchema = new Schema({
  name: String,
  username: String,
});

module.exports = mongoose.model("ReplyingTo", ReplyingToSchema);
