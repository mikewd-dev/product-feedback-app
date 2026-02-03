const mongoose = require("mongoose");
const Request = require("./models/request");

const ObjectId = mongoose.Types.ObjectId;



async function addIdsToComments() {
  
  const requests = await Request.find();

  
  for (const request of requests) {
   
    for (let i = 0; i < request.comments.length; i++) {
      const comment = request.comments[i];
     
      if (!comment._id) {
        request.comments[i]._id = new ObjectId();
        console.log(comment._id);
      }
    }
    await request.save();
  }
}
