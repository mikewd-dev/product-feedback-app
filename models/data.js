const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  currentUser:{
    image: String,
    name: String,
    username: String
  },
  productRequests:[
    {
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
            image: String,
            name: String,
            username: String,
          },

        replies: [
            {
              content: String,
              replyingTo: String,
              user: {
                image: String,
                name: String,
                username: String
              }
            },
        ]
    }
      ],
    }
  ]
})

module.exports = mongoose.model('Data', DataSchema);
