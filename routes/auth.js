const express = require("express");
const router = express.Router();
const passport = require("passport");

// Route to start Google Authentication
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Route for Google callback
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/products"
}), (err, req, res, next) => {
  console.error(err); // Log the error for debugging
  res.redirect("/");
});

// Logout route
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
