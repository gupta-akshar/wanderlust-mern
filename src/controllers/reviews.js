const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  // Prevent creating reviews for non-existent listings
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewID } = req.params;

  // Ensures users can delete only their own reviews
  const review = await Review.findOneAndDelete({
    _id: reviewID,
    author: req.user._id,
  });

  if (!review) {
    req.flash("error", "Review not found or not authorized");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewID },
  });

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
