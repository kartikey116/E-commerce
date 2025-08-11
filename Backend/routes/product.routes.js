import express from "express";
import { 
      getAllProducts , 
      getFeaturedProducts, 
      createProduct, 
      deleteProduct, 
      getRecommendation, 
      getProductsByCategory,
      toggleFeaturedProduct,
    } from "../controllers/product.controller.js";
import { adminRoutes, protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoutes,adminRoutes,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendation",getRecommendation);
router.post("/",protectRoutes,adminRoutes,createProduct);
router.patch("/:id",protectRoutes,adminRoutes,toggleFeaturedProduct);
router.delete("/:id",protectRoutes,adminRoutes,deleteProduct);

export default router;