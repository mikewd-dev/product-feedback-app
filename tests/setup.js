const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.SECRET = process.env.SECRET || "thisshouldbeabettersecret";
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error("Refusing to connect to non-test DB!");
  }

  const dbUri = process.env.MONGO_URI_TEST; 
  if (!dbUri) throw new Error("MONGO_URI_TEST is not defined!");

  await mongoose.connect(dbUri, {
 
  });
  console.log("Connected to test DB:", mongoose.connection.name);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log('Test DB disconnected');
});