const jwt = require('jsonwebtoken');

// Generates a signed JWT containing the user's id. Expires in 30 days by default.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = generateToken;
