const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env

function auth(req, res, next) {
    try {
        const token = req.cookies.AdminToken;
        if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

        const verified = jwt.verify(token, JWT_SECRET);
        req.adminInfo = verified;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = auth;