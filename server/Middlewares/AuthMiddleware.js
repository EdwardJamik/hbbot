const User = require("../Models/manager.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, JWT_SECRET, async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id)
            if (user) return res.json({ status: true, user: user.username, root: user.root })
            else return res.json({ status: false })
        }
    })
}