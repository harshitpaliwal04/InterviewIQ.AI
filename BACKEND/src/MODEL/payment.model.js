const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        planId: {
                type: String,
                required: true,
                enum: ['basic', 'pro', 'free']
        },
        amount: {
                type: Number,
                required: true
        },
        credits: {
                type: Number,
                required: true
        },
        razorpayOrderId: {
                type: String,
                required: true,
                unique: true
        },
        razorpayPaymentId: {
                type: String,
                sparse: true
        },
        status: {
                type: String,
                enum: ['created', 'paid', 'failed', 'refunded'],
                default: 'created'
        },
        paidAt: {
                type: Date
        },
        createdAt: {
                type: Date,
                default: Date.now
        }
});

module.exports = mongoose.model('Payment', paymentSchema);