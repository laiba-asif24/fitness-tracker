const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's DNS resolver — fixes "queryTxt ETIMEOUT"
// errors caused by ISP/router DNS servers that don't support SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ doesn't need useNewUrlParser/useUnifiedTopology anymore,
      // but keeping options object here in case you're on an older version.
    });
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;