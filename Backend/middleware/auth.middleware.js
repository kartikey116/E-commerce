import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoutes = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - Access token is not present" });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
    }
}

export const adminRoutes = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
    }
    next();
}