const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema for Orders
const orderSchema = new mongoose.Schema({
orderId:{
  type: String,
  require: true,
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
  },
});

const orderModel = mongoose.model("Order", orderSchema);

// Joi validation schema for incoming order data
const validateOrder = (order) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.string().required(),
    totalPrice: Joi.number().required(),
    address: Joi.string().required(),
    status: Joi.string().valid("pending", "shipped", "delivered", "cancelled"),
    payment: Joi.string().required(),
    delivery: Joi.string().optional(),
  });

  return schema.validate(order);
};

module.exports = { orderModel, validateOrder };
