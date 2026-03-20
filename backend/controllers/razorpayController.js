const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/razorpay/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body; // receipt can be the outfitho order ID

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: receipt
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Some error occured while creating Razorpay order");
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/razorpay/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        outfithoOrderId
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
        return res.status(400).json({ message: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
    const order = await Order.findById(outfithoOrderId);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: razorpayPaymentId,
            status: 'success',
            update_time: new Date().toISOString()
        };
        await order.save();
        res.json({
            message: "Payment successfully verified",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Razorpay Key ID
// @route   GET /api/razorpay/key
// @access  Private
const getRazorpayKey = async (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
};
