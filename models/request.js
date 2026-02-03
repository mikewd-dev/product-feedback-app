const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  id: Number,
  title: String,
  category: String,
  upvotes: { type: Number, default: 0 },
  status: String,
  description: String,
  comments: [
    {
      id: Number,
      content: String,
      user: {
        type: Object,
        image: [
          {
            url: String,
            filename: String,
          },
        ],
        name: String,
        username: String,
      },
      replies: [
        {
          content: String,
          replyingTo: String,
          user: {
            type: Object,
            image: [
              {
                url: String,
                filename: String,
              },
            ],
            name: String,
            username: String,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Request", RequestSchema);
