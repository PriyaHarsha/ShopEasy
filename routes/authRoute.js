import express from "express";
import {
  loginController,
  registerController,
  testController,
  otpController,
  passwordController,
  addAddressController,
  getAddressController,
  deleteAddressController,
  updateAddressController,
  updateProfileController,
  getuserOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import Razorpay from "razorpay";

//create razor pay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

//router object
const router = express.Router();

//routing
//Register
router.post("/register", registerController);

//LOGIN
router.post("/login", loginController);

//test
router.post("/test", requireSignIn, isAdmin, testController);

//protected route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Add new address
router.put("/add-address", requireSignIn, addAddressController);

//Get address
router.get("/get-address/:email", requireSignIn, getAddressController);

//Generate OTP
router.post("/forget-pw", otpController);

//Reset password
router.put("/reset-pw", passwordController);

//Delete address
router.put("/delete-address", requireSignIn, deleteAddressController);

//Update address
router.put("/update-address", requireSignIn, updateAddressController);

//update profile
router.put("/update-profile", requireSignIn, updateProfileController);

//protected Admin route

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//get orders for user
router.get("/get-user-orders", requireSignIn, getuserOrdersController);

//get all orders for admin
router.get("/get-all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

////get api key
router.get("/getkey", requireSignIn, (req, res) =>{ 
  console.log(process.env.RAZORPAY_API_KEY)
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY }})
);
export default router;
