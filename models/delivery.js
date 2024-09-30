// Importing required modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Delivery Schema
const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    trackingURL: {
        type: String,
        required: true,
        match: /^(ftp|http|https):\/\/[^ "]+$/ // Simple URL validation
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 1 // Assuming delivery time is in hours or days
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Mongoose Model
const deliveryModel = mongoose.model("delivery", deliverySchema);

// Joi Validation for Delivery
const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId as string
        deliveryBoy: Joi.string().min(3).max(50).required(),
        totalPrice: Joi.number().min(0).required(),
        trackingURL: Joi.string().uri(), // URI validation
        estimatedDeliveryTime: Joi.number().min(1).required() // Time in hours/days
    });

    return schema.validate(data);
};

module.exports = {
    deliveryModel,
    validateDelivery
};
