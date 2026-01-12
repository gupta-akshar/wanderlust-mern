module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store original URL so user can be redirected back after login
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};
