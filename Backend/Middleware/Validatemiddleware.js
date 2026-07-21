const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator's check()/body() rules to collect and throw errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new ApiError(400, message);
  }
  next();
};

module.exports = validate;
