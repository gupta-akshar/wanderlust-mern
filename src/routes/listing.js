const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwner = require("../middlewares/isOwner");
const validateListing = require("../middlewares/validateListing");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const ExpressError = require("../utils/ExpressError");
const { storage } = require("../config/cloudConfig.js");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new ExpressError(400, "Only JPG, JPEG, and PNG images are allowed"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
