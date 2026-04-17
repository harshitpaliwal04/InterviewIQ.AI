const express = require("express");
const {isAuth} = require("../MIDDLEWARE/isAuth")
const { verifyPayment, createOrder  } = require("./../CONTROLLER/payment.controller")
const { get_credits } = require("../CONTROLLER/auth.controller")

const paymentRouter = express.Router()

paymentRouter.post("/order" , isAuth , createOrder )
paymentRouter.post("/verify" , isAuth , verifyPayment )
paymentRouter.get("/credits", isAuth, get_credits)

module.exports = paymentRouter;