// Utility to catch async errors in Express routes and pass them to next()
module.exports = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
