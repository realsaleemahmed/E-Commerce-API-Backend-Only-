const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectToDB = await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected Succesfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;