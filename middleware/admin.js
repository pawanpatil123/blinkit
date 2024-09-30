const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to validate if the admin is logged in with a valid token
async function validateAdmin(req, res, next) {
  try {
    let token = req.cookies.token;

    // If no token is present, redirect to login
    if (!token) return res.status(401).send("You need to login first");

    // Verify the token
    let data = await jwt.verify(token, process.env.JWT_KEY);

    // Add the user information to the request object for use in further middleware/routes
    req.user = data;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // Handle token verification errors
    res.status(401).send("Invalid or expired token. Please log in again.");
  }
}

// Middleware to check if a user is authenticated (e.g., using Passport.js)
async function userIsLoggedIn(req, res, next) {
  // Check if the user is authenticated, typically used with Passport.js
  if (req.isAuthenticated()) {
    return next();  // If authenticated, proceed to the next handler
  }

  // If not authenticated, redirect to the login page
  res.redirect("/users/login");
}

module.exports = { validateAdmin, userIsLoggedIn };
