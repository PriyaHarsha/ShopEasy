import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  addToWishlistController,
  getAllWishlistController,
  removeFromWishlistController,
} from "../controllers/wishlistController.js";

//router object
const router = express.Router();

//get all cart items
router.get(
  "/get-all-wishlist/:userId",
  requireSignIn,
  getAllWishlistController
);

//Add to cart
router.post("/add-to-wishlist", requireSignIn, addToWishlistController);

//Add to cart
router.post(
  "/remove-from-wishlist",
  requireSignIn,
  removeFromWishlistController
);

export default router;
