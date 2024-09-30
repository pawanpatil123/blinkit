require('dotenv').config();
const Payment = require("../models/payment"); // Correct import of Payment model
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order route
router.post('/create/orderId', async (req, res) => {
  const options = {
    amount: 5000 * 100, // amount in smallest currency unit
    currency: "INR",
  };

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Create payment entry in the database
    const newPayment = new Payment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'pending',
    });

    await newPayment.save(); // Save to the database

    // Send order details as a response
    res.status(200).json(order);

  } catch (error) {
    console.error("Error creating order or saving payment:", error);
    res.status(500).send('Error creating order');
  }
});

// Verify payment route
router.post('/api/payment/verify', async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js');

    // Verify the payment
    const result = validatePaymentVerification(
      { "order_id": razorpayOrderId, "payment_id": razorpayPaymentId },
      signature,
      secret
    );

    if (result) {
      // Find payment in the database
      const payment = await Payment.findOne({ orderId: razorpayOrderId, status: 'pending' });

      if (payment) {
        // Update payment details and save
        payment.paymentId = razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();

        res.status(200).json({ status: 'success' });
      } else {
        res.status(404).send('Payment not found');
      }

    } else {
      res.status(400).send('Invalid signature');
    }

  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send('Error verifying payment');
  }
});

module.exports = router;
