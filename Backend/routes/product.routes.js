import express from "express";
import {getAllProducts , getFeaturedProducts, createProduct, deleteProduct} from "../controllers/product.controller.js";
import { adminRoutes, protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoutes,adminRoutes,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/recommendation",getRecommendation);
router.post("/",protectRoutes,adminRoutes,createProduct);
router.delete("/:id",protectRoutes,adminRoutes,deleteProduct);

export default router;