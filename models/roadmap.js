const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoadmapSchema = new Schema({
  title: String,
  category: String,
  upvotes: {
    type: Number, default: 0
  },
  status: String,
  description: String,
  comments: [
    {
      content: String,
      user: {
        image: String,
        name: String,
        username: String,
      },
    },
  ],
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);