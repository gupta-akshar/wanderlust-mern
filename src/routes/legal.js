const express = require("express");
const router = express.Router();

// Privacy Policy
router.get("/privacy", (req, res) => {
  res.render("legal/privacy");
});

// Terms & Conditions
router.get("/terms", (req, res) => {
  res.render("legal/terms");
});

module.exports = router;
