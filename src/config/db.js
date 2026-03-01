const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:root@clusterecommerce.grqptpf.mongodb.net/m1p13mean_miangaly_tahina_dev?appName=ClusterEcommerce");//process.env.MONGO_URI
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
