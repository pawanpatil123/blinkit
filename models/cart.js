// Importing required modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Mongoose Model
const cartModel = mongoose.model("cart", cartSchema);

// Joi Validation for Cart
const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Expecting ObjectId as a string
        products: Joi.string().required(), // Expecting ObjectId as a string
        totalPrice: Joi.number().min(0).required()
    });

    return schema.validate(data);
};

module.exports = {
    cartModel,
    validateCart
};
