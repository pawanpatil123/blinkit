const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require("../models/user");
const passport = require("passport");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, cb) {
    try {
      // Ensure that the profile contains an email
      const email = profile.emails && profile.emails[0].value;
      if (!email) {
        return cb(new Error('No email associated with this Google account'), false);
      }

      // Check if the user already exists
      let user = await userModel.findOne({ email: email });

      if (!user) {
        // Create a new user if one doesn't exist
        user = new userModel({
          name: profile.displayName,
          email: email,
        });
        await user.save(); // Save the new user to the database
      }

      // Return the user object
      cb(null, user);
    } catch (err) {
      // Handle errors and pass to the callback
      cb(err, false);
    }
  }
));

// Serialize the user for the session
passport.serializeUser(function (user, cb) {
  cb(null, user._id); // Store user id in session
});

// Deserialize the user from the session
passport.deserializeUser(async function (id, cb) {
  try {
    let user = await userModel.findById(id); // Find the user by ID
    cb(null, user); // Pass the user object to the callback
  } catch (err) {
    cb(err, null); // Pass any error to the callback
  }
});

module.exports = passport;
