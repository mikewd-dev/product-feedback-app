const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoadmapSchema = new Schema({
  id: Number,
  title: String,
  category: String,
  upvotes: Number,
  status: String,
  description: String,
  comments: [
    {
      id: Number,
      content: String,
      user: {
        type: Object,
        image: String,
        name: String,
        username: String,
      },
    },
  ],
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);
