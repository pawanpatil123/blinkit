// Importing required modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Admin Schema
const adminSchema = new mongoose.Schema({
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
        required: true,
        minlength: 6,
        maxlength: 255
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'superadmin'], // Ensures that only 'admin' or 'superadmin' is allowed
        default: 'admin'
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Mongoose Model
const adminModel = mongoose.model("admin", adminSchema);

// Joi Validation for Admin
const validateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
        role: Joi.string().valid('admin', 'superadmin').required() // Only 'admin' or 'superadmin' allowed
    });

    return schema.validate(data);
};

module.exports = {
    adminModel,
    validateAdmin
};
