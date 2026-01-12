// Custom error class for handling HTTP errors in Express
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode; // HTTP status code
    this.message = message; // Error message to display
  }
}

module.exports = ExpressError;
