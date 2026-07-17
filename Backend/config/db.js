const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI defined in .env (MONGO_URI).
 * Call this once when the Express server starts (e.g. in server.js):
 *
 *   const connectDB = require('./config/db');
 *   connectDB();
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ no longer needs useNewUrlParser / useUnifiedTopology,
      // they are defaults now — kept here as a comment for reference.
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;
