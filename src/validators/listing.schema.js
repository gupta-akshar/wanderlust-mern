const Joi = require("joi");

// Validation schema for listing creation/update
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),

    // Image field can be empty or null (handled separately in multer/cloudinary)
    image: Joi.string().allow("", null),

    // Restrict category to predefined options
    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic",
        "mountains",
        "castles",
        "pools",
        "camping",
        "farms",
        "arctic",
        "domes",
        "boats"
      )
      .required(),
  }).required(),
});
