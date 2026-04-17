const jwt = require('jsonwebtoken');
const UserModel = require('./../MODEL/user.model');

const isAuth = async (req, res, next) => {
        // ✅ Safe token extraction
        const token = req.cookies.token;

        if (!token) {
                return res.status(401).json({
                        success: false,
                        message: "Unauthorized, Token is missing",
                });
        }

        try {
                // ✅ Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

                if (!decoded) {
                        return res.status(401).json({
                                success: false,
                                message: "Unauthorized, Token invalid"
                        });
                }

                // ✅ Attach full user object or at least user ID
                req.user = { id: decoded.id };  // Make sure structure matches what controller expects
                req.userId = decoded.id;

                next();

        } catch (err) {
                console.log("AUTH ERROR:", err.message);

                return res.status(401).json({
                        success: false,
                        message: "Token is not valid"
                });
        }
};

// ✅ Export as a function directly (not an object)
module.exports = {isAuth};