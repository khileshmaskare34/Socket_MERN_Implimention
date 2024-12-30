const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to database');
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

connectToDatabase();




