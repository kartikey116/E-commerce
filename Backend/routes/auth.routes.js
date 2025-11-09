import express from "express";
import {signup,login,logout} from "../controllers/auth.controller.js";
import loginLimiter from "../middleware/loginLimiter.js";
import {refreshToken} from "../controllers/auth.controller.js";
import {getProfile} from "../controllers/auth.controller.js";
import {requestOTP,verifyOTP,resetPassword} from "../controllers/auth.controller.js";
import { protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",loginLimiter,login);
router.post("/logout", logout);
router.post("/refreshToken",refreshToken);
router.get("/profile",protectRoutes,getProfile);

router.post("/request-otp", requestOTP);              
router.post("/verify-otp", verifyOTP);                
router.post("/reset-password", resetPassword);  


export default router;