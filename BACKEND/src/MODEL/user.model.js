const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        name: {
                type: String,
                required: true,
        },
        email: {
                type: String,
                required: true,
                unique: true,
        },
        credits: {
                type: Number,
                default: 100
        },
        paymentHistory: [{
                paymentId: String,
                orderId: String,
                amount: Number,
                credits: Number,
                date: Date
        }]

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;