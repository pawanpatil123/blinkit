const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateAdmin } = require("../middleware/admin");

require("dotenv").config();

// Check if environment is development
if (process.env.NODE_ENV === "DEVELOPMENT") {
  router.get("/create", async function (req, res) {
    try {
      // Check if the admin email already exists
      let existingUser = await adminModel.findOne({ email: "piy@gmail.com" });
      if (existingUser) {
        return res.status(400).send("Admin with this email already exists");
      }

      // If no existing admin, create a new admin
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash("admin", salt);

      let user = new adminModel({
        name: "piyush",
        email: "piy@gmail.com",
        password: hash,
        role: "admin",
      });

      await user.save();

      let token = jwt.sign({ email: "piy@gmail.com", admin: true }, process.env.JWT_KEY);

      // Set the token in cookies and send a success message
      res.cookie("token", token);
      res.send("Admin created successfully");
    } catch (err) {
      res.status(500).send("Error creating admin: " + err.message);
    }
  });
}

// Admin login page
router.get("/login", async function (req, res) {
  res.render("admin_login");  // Render the admin login page
});

// Admin login POST handler
router.post("/login", async function (req, res) {
  let { email, password } = req.body;

  let user = await adminModel.findOne({ email: email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  let validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  let token = jwt.sign({ email: user.email, admin: true }, process.env.JWT_KEY);
  res.cookie("token", token);  // Set JWT token in cookies
  res.redirect("/admin/dashboard");  // Redirect to admin dashboard
});

// Admin dashboard route
router.get("/dashboard", validateAdmin, async function (req, res) {
  try {
    let prodcount = await productModel.countDocuments();
    let categcount = await categoryModel.countDocuments();

    res.render("admin_dashboard", { prodcount, categcount });  // Render the dashboard with product and category counts
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get products, grouped by category, and limit to 10 products per category
router.get("/products", validateAdmin, async function (req, res) {
  try {
    const resultArray = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },  // Push all products into an array for each category
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",  // Add category field
          products: { $slice: ["$products", 10] },  // Limit to 10 products
        },
      },
    ]);

    // Convert the result array into an object
    const resultObject = resultArray.reduce((acc, item) => {
      acc[item.category] = item.products;  // Category as key, products as value
      return acc;
    }, {});

    res.render("admin_products", { products: resultObject });  // Render the products grouped by category
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin logout route
router.get("/logout", validateAdmin, async function (req, res) {
  res.cookie("token", "");  // Clear the token cookie
  res.redirect("/admin/login");  // Redirect to login page after logout
});

module.exports = router;
