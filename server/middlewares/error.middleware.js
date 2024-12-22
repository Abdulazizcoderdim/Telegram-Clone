const BaseError = require("../errors/base.errors");

module.exports = function (err, req, res, next) {
  if (err instanceof BaseError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    message: err.message || 'An error occurred while processing the request.',
  });
};
