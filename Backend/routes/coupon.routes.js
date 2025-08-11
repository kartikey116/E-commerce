import express from "express";
import { protectRoutes } from "../middleware/auth.middleware";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller";


const router = express.Router();
router.get("/",protectRoutes,getCoupon);
router.get("/validate",protectRoutes,validateCoupon);

export default router;
