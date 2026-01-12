const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from listings
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");

const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isReviewAuthor = require("../middlewares/isReviewAuthor.js");
const validateReview = require("../middlewares/validateReview.js");

// POST new review for a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE a review by its author
router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
