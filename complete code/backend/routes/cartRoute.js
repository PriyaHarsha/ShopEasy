import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  addToCartController,
  deleteCartController,
  getAllCartController,
  getCartIdController,
  reduceCartController,
  removeFromCartController,
} from "../controllers/cartController.js";

//router object
const router = express.Router();

//get all cart items
router.get("/get-all-cart/:userId", requireSignIn, getAllCartController);

//Add to cart
router.post("/add-to-cart", requireSignIn, addToCartController);

//reduce cart quantity by 1
router.post("/reduce-cart", requireSignIn, reduceCartController);

//remove entire product from cart
router.post("/remove-from-cart", requireSignIn, removeFromCartController);

//get cart id
router.get("/get-cart-id/:userId", requireSignIn, getCartIdController);

//remove entire product from cart
router.delete("/delete-cart/:id", requireSignIn, deleteCartController);
export default router;
