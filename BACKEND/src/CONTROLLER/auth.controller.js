const { findById } = require('../MODEL/payment.model');
const UserModel = require('../MODEL/user.model');
const jwt = require('jsonwebtoken');

async function CreateUserByGoogleAuth(req, res) {
        try {
                const { name, email } = req.body;

                if (!name || !email) {
                        return res.status(400).json({
                                success: false,
                                message: "Name and email are required"
                        });
                }

                let flag = false;

                let User = await UserModel.findOne({ email });

                if (!User) {
                        User = await UserModel.create({ name, email });
                        flag = true;

                }

                const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

                res.cookie("token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 24 * 60 * 60 * 1000
                })

                if (flag) {
                        return res.status(201).json({
                                message: "Registered Successfully",
                                User: {
                                        _id: User._id,
                                        name: User.name,
                                        email: User.email,
                                        credits: User.credits
                                },
                                token
                        });
                }
                else {
                        return res.status(201).json({
                                message: "Logged In Successfully",
                                User: {
                                        _id: User._id,
                                        name: User.name,
                                        email: User.email,
                                        credits: User.credits
                                },
                                token
                        });
                }


        }
        catch (err) {
                return res.status(500).json({ message: err.message })
        }
}

async function LoginUserByGoogleAuth(req, res) {
        try {
                await res.clearCookie("token")
                return res.status(200).json({ message: "Logged Out Successfully" })
        }
        catch (err) {
                return res.status(500).json({ message: err.message })
        }
}

async function get_credits(req, res) {
        try {
                // ✅ Get userId from authenticated user (from isAuth middleware)
                const userId = req.user?.id || req.userId || req.user;
                console.log(userId)

                if (!userId) {
                        return res.status(401).json({
                                success: false,
                                message: "User not authenticated"
                        });
                }

                // ✅ Fix: findById takes the ID directly, not an object
                const user = await UserModel.findById(userId);

                if (!user) {
                        return res.status(404).json({
                                success: false,
                                message: "User not found"
                        });
                }

                // ✅ Return credits information
                return res.status(200).json({
                        success: true,
                        message: "Credits retrieved successfully",
                        credits: user.credits,
                        user: {
                                id: user._id,
                                name: user.name,
                                email: user.email
                        }
                });

        } catch (error) {
                console.error("Get credits error:", error);
                return res.status(500).json({
                        success: false,
                        message: "Failed to fetch credits",
                        error: error.message
                });
        }
}


module.exports = { CreateUserByGoogleAuth, LoginUserByGoogleAuth, get_credits };