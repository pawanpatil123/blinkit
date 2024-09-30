// Importing required modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Mongoose Model
const categoryModel = mongoose.model("category", categorySchema);

// Joi Validation for Category
const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(data);
};

module.exports = {
    categoryModel,
    validateCategory
};
