const Joi = require("joi");

// Validation schema for reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Must be 1–5
    comment: Joi.string().required(),
  }).required(),
});
