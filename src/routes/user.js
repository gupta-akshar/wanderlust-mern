const express = require("express");
const router = express.Router();
const passport = require("passport");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.js");
const userController = require("../controllers/users.js");

// Sign up routes
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// Login routes
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // save original URL to redirect after login
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Logout
router.get("/logout", userController.logout);

module.exports = router;
