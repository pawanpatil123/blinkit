// Importing required modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Address Schema
const AddressSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
        min: 10000,  // Assuming zip codes have 5 digits
        max: 99999
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
});

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Simple email validation
    },
    password: {
        type: String,
        minlength: 6,
       
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/ // Simple 10-digit phone validation
    },
    addresses: {
        type: [AddressSchema],
        required: true
    }
}, { timestamps: true }); // Corrected timestamps option

// Mongoose Model
const userModel = mongoose.model("user", userSchema);

// Joi Validation for User
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(255),
        phone: Joi.string().pattern(/^[0-9]{10}$/),
        addresses: Joi.array().items(Joi.object({
            state: Joi.string().required(),
            zip: Joi.number().integer().min(10000).max(99999).required(),
            city: Joi.string().required(),
            address: Joi.string().required()
        })).min(1).required() // At least one address is required
    });

    return schema.validate(data);
};

module.exports = {
    userModel,
    validateUser
};
 