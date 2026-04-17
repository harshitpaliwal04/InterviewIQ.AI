const Payment = require("./../MODEL/payment.model"); // Fixed: consistent naming
const User = require("../MODEL/user.model");
const crypto = require("crypto");
const razorpay = require("../SERVICES/razorpay.services");

const createOrder = async (req, res) => {
        try {
                const { planId, amount, credits } = req.body;

                // Validate required fields
                if (!planId || !amount || !credits) {
                        return res.status(400).json({
                                success: false,
                                message: "Missing required fields: planId, amount, or credits"
                        });
                }

                // Validate user authentication
                if (!req.user || !req.user.id) {
                        return res.status(401).json({
                                success: false,
                                message: "User not authenticated"
                        });
                }

                // Validate amount is positive
                if (amount <= 0) {
                        return res.status(400).json({
                                success: false,
                                message: "Invalid amount"
                        });
                }

                const options = {
                        amount: amount * 100, // convert to paise
                        currency: "INR",
                        receipt: `receipt_${Date.now()}`,
                        notes: {
                                planId: planId,
                                userId: req.user.id,
                                credits: credits.toString()
                        }
                };

                // Create order in Razorpay
                const order = await razorpay.orders.create(options);

                // Create payment record in database
                const payment = new Payment({
                        userId: req.user.id, // Fixed: using req.user.id
                        planId: planId,
                        amount: amount,
                        credits: credits,
                        razorpayOrderId: order.id,
                        status: "created",
                        createdAt: new Date()
                });

                await payment.save();

                return res.status(200).json({
                        success: true,
                        id: order.id,
                        amount: order.amount,
                        currency: order.currency,
                        orderId: order.id
                });

        } catch (error) {
                console.error("Create order error:", error);
                return res.status(500).json({
                        success: false,
                        message: "Failed to create Razorpay order",
                        error: error.message
                });
        }
};

const verifyPayment = async (req, res) => {
        try {
                const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                } = req.body;

                // Validate required fields
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                        return res.status(400).json({
                                success: false,
                                message: "Missing payment verification details"
                        });
                }

                // Verify signature
                const body = razorpay_order_id + "|" + razorpay_payment_id;
                const expectedSignature = crypto
                        .createHmac("sha256", process.env.RZP_SECRET_KEY) // Fixed: use correct env variable
                        .update(body)
                        .digest("hex");

                if (expectedSignature !== razorpay_signature) {
                        return res.status(400).json({
                                success: false,
                                message: "Invalid payment signature"
                        });
                }

                // Find payment record
                const payment = await Payment.findOne({
                        razorpayOrderId: razorpay_order_id
                });

                if (!payment) {
                        return res.status(404).json({
                                success: false,
                                message: "Payment record not found"
                        });
                }

                // Check if already processed
                if (payment.status === "paid") {
                        return res.status(200).json({
                                success: true,
                                message: "Payment already processed",
                                user: await User.findById(payment.userId).select("-password")
                        });
                }

                // Update payment record
                payment.status = "paid";
                payment.razorpayPaymentId = razorpay_payment_id;
                payment.paidAt = new Date();
                await payment.save();

                // Add credits to user with atomic operation
                const updatedUser = await User.findByIdAndUpdate(
                        payment.userId,
                        {
                                $inc: { credits: payment.credits },
                                $push: {
                                        paymentHistory: {
                                                paymentId: razorpay_payment_id,
                                                orderId: razorpay_order_id,
                                                amount: payment.amount,
                                                credits: payment.credits,
                                                date: new Date()
                                        }
                                }
                        },
                        { new: true } // Return updated document
                ).select("-password"); // Exclude password from response

                if (!updatedUser) {
                        return res.status(404).json({
                                success: false,
                                message: "User not found"
                        });
                }

                return res.status(200).json({
                        success: true,
                        message: "Payment verified and credits added successfully",
                        user: updatedUser,
                        payment: {
                                id: payment._id,
                                amount: payment.amount,
                                credits: payment.credits,
                                status: payment.status
                        }
                });

        } catch (error) {
                console.error("Verify payment error:", error);
                return res.status(500).json({
                        success: false,
                        message: "Failed to verify payment",
                        error: error.message
                });
        }
};

// Additional helper function to check payment status
const getPaymentStatus = async (req, res) => {
        try {
                const { orderId } = req.params;

                const payment = await Payment.findOne({
                        razorpayOrderId: orderId
                });

                if (!payment) {
                        return res.status(404).json({
                                success: false,
                                message: "Payment not found"
                        });
                }

                return res.status(200).json({
                        success: true,
                        status: payment.status,
                        amount: payment.amount,
                        credits: payment.credits
                });

        } catch (error) {
                return res.status(500).json({
                        success: false,
                        message: "Failed to fetch payment status"
                });
        }
};

module.exports = {
        verifyPayment,
        createOrder     
};