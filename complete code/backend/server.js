import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import morgan from "morgan";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productsRoute.js";
import cartRoute from "./routes/cartRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from "url";

//dotenv configuration
dotenv.config();

//esmodulefix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//data base configuration
connectDB();

//create razor pay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

//express app configuration
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./frontend/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/wishlist", wishlistRoute);

//REST API
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

// //get api key
// app.get("/api/v1/getkey", (req, res) =>
//   res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
// );

//port access
const PORT = process.env.PORT || 8000;

//server listening
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
