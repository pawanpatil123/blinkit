const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema for Products
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  description: {
    type: String,
   
  },
  image: {
    type: Buffer,
    
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const productModel = mongoose.model("Product", productSchema);

// Joi validation schema for incoming product data
const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
  });

  return schema.validate(product);
};

module.exports = { productModel, validateProduct };
