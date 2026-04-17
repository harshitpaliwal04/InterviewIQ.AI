const UserModel = require('../MODEL/user.model');

async function getCurrentUser(req, res) {
        try {
                const userId = req.user;
               
                const user = await UserModel.findById(userId);
                if (!user) {
                        return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json({ user });
        }
        catch (err) {
                return res.status(500).json({ message: "Failed to get data " + err.message })
        }
}

module.exports = { getCurrentUser };