import express from "express";
import { protectRoutes } from "../middleware/auth.middleware";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/create-checkout-session",protectRoutes, createCheckoutSession);
router.post("/checkout-success",protectRoutes,checkoutSuccess);
    

export default router;