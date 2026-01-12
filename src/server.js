// Load environment variables from .env file
require("dotenv").config();

const mongoose = require("mongoose"); // MongoDB ORM
const session = require("express-session"); // Express session middleware
const MongoStore = require("connect-mongo"); // Store sessions in MongoDB

const app = require("./app"); // Main Express app
const passportConfig = require("./config/passport"); // Passport authentication config

// Server port from environment or fallback to 8080
const PORT = process.env.PORT || 8080;
// MongoDB connection URL from environment
const DB_URL = process.env.MONGO_URL;

// Immediately Invoked Async Function Expression (IIFE) to start server
(async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected");

    // Configure MongoDB-backed session store
    const store = MongoStore.create({
      mongoUrl: DB_URL, // MongoDB connection for storing sessions
      touchAfter: 24 * 60 * 60, // Only update session once every 24h if unchanged (reduces DB writes)
    });

    // Log errors in session store
    store.on("error", (err) => console.error("MongoStore Error:", err));

    // Configure express-session middleware
    app.use(
      session({
        store, // Use MongoDB as session store
        secret: process.env.SESSION_SECRET, // Secret for signing the session ID cookie
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't save uninitialized sessions
        cookie: {
          httpOnly: true, // Prevent client-side JS from accessing the cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires after 7 days
        },
      })
    );

    // Initialize Passport for authentication
    passportConfig();

    // Start Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    // Catch and log any errors during startup
    console.error("Startup failed:", err);
  }
})();
