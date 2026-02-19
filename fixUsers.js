require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Request = require("./models/request");

async function resurrectUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Starting recovery...");

    // 1. Get all requests that have comments/replies
    const requests = await Request.find({});
    
    // We'll use a Set to keep track of usernames we've already fixed
    const processedUsernames = new Set();

    for (const req of requests) {
      if (req.comments && req.comments.length > 0) {
        for (const comment of req.comments) {
          await processUser(comment.user);
          
          if (comment.replies && comment.replies.length > 0) {
            for (const reply of comment.replies) {
              await processUser(reply.user);
            }
          }
        }
      }
    }

    console.log("Recovery complete! Your 'Ghost Users' are now real accounts.");
  } catch (err) {
    console.error("Recovery failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

async function processUser(userData) {
  const existingUser = await User.findOne({ username: userData.username });
  
  if (!existingUser) {
    console.log(`Resurrecting user: ${userData.username}`);
    
    const newUser = new User({
      username: userData.username,
      name: userData.name,
      // We wrap the string in the array/object structure your schema requires
      image: [
        {
          url: userData.image,
          filename: `recovered_${userData.username}` 
        }
      ]
    });

    try {
      // Passport handles the hashing for the password 'password123'
      await User.register(newUser, 'password123');
    } catch (regErr) {
      console.error(`Could not register ${userData.username}:`, regErr.message);
    }
  }
}

resurrectUsers();