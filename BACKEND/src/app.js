const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
        origin: "https://frontend-interviewiq-ai.onrender.com",
        credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('../src/ROUTES/auth.routes'));

app.use('/api/user', require('../src/ROUTES/user.routes'));

app.use('/api/interview', require('../src/ROUTES/interview.routes'));

app.use("/api/payment" , require("../src/ROUTES/payment.routes"))

app.get("/", (req, res)=>{
        res.send("InterviewIQ.AI Backend is running")
})

module.exports = app;
