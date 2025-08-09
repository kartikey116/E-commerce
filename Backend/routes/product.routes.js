import express from "express";
import {getAllProducts , getFeaturedProducts} from "../controllers/product.controller.js";
import { adminRoutes, protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoutes,adminRoutes,getAllProducts);
router.get("/featured",getFeaturedProducts);

export default router;