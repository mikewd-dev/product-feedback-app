const mongoose = require('mongoose');
const Request = require('./models/request');

const ObjectId = mongoose.Types.ObjectId;

// loop through all requests

async function addIdsToComments() {


// find all requests
const requests = await Request.find();

// loop through all requests
for (const request of requests) {
  // loop through all comments of the request
  for (let i = 0; i < request.comments.length; i++) {
    const comment = request.comments[i];
    // check if the comment doesn't have an ObjectId
    if (!comment._id) {
      // assign a new ObjectId to the comment
      request.comments[i]._id = new ObjectId();
      console.log(comment._id)
    }

  }
  await request.save();

}
}





