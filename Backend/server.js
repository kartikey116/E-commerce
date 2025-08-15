import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import analyticRoutes from "./routes/analytics.route.js"
import connectDB from "./lib/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/analytic",analyticRoutes);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.listen(PORT, () => {
  console.log("Server is running on port" + PORT);
  connectDB();
});