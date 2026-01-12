// core
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

// auth
const passport = require("passport");

// utils
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// routes
const legalRouter = require("./routes/legal");
const listingRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

// locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// routes
app.get("/", (req, res) => res.redirect("/listings"));
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/", legalRouter);

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

module.exports = app;
