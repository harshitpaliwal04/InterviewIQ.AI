const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
        question: String,
        answer: String,
        timeLimit: Number,
        feedback: String,
        communication: {
                type: Number,
                default: 0
        },
        confidence: {
                type: Number,
                default: 0
        },
        correctness: {
                type: Number,
                default: 0
        },
        score: {
                type: Number,
                default: 0
        }
})

const InterviewSchema = new mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
        },
        role: {
                type: String,
                required: true
        },
        experience: {
                type: String,
                required: true
        },
        mode: {
                type: String,
                enum: ["Technical", "Behavioral"],
                required: true
        },
        text: {
                type: String,
        },
        questions: [questionSchema],
        totalScore: {
                type: Number,
                default: 0
        },
        status: {
                type: String,
                enum: ["Pending", "Completed"],
                default: "Pending"
        }
}, { timestamps: true })

module.exports = mongoose.model("Interview", InterviewSchema);