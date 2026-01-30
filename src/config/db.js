const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error("Could not connect to MongoDB after multiple attempts");
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

module.exports = { connectDB };
