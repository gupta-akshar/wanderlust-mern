const Listing = require("../models/listing.js");
const { cloudinary } = require("../config/cloudConfig.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category } = req.query;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index.ejs", {
    allListings,
    category,
  });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  if (!req.file) {
    req.flash("error", "Image upload failed");
    return res.redirect("/listings/new");
  }

  const { path: url, filename } = req.file;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  const features = response.body.features;
  if (!features || features.length === 0) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }
  newListing.geometry = features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }

  listing.set(req.body.listing);

  if (req.file) {
    const oldFilename = listing.image?.filename;

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await listing.save();

    if (oldFilename) {
      try {
        await cloudinary.uploader.destroy(oldFilename);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }
  } else {
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }

  const filename = listing.image?.filename;

  await Listing.findByIdAndDelete(id);

  if (filename) {
    try {
      await cloudinary.uploader.destroy(filename);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }
  }

  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
