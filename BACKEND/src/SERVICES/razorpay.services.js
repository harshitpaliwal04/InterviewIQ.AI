require("dotenv").config();
const Razorpay = require("razorpay");
const rzp = require("razorpay")


const razorpay = new Razorpay({
        key_id: process.env.RZP_ID,
        key_secret: process.env.RZP_SECRET_KEY,
});

module.exports = razorpay;
