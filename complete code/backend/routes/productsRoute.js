import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  VerifyPaymentController,
  checkoutController,
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductController,
  getSingleProductConteroller,
  getTotalController,
  productFiltersController,
  productPhotoController,
  productReviewController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/producrController.js";
import formidableMiddleware from "express-formidable";
import { instance } from "../server.js";

//router object
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

//update product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);

//get all products with photo as a buffer data
router.get("/get-products/:page", getProductController);

//get single product
router.get("/get-single-product/:slug", getSingleProductConteroller);

//delete product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  deleteProductController
);

//get all products details with out photo
router.get("/get-all-products/:page", getAllProductsController);

//get photo
router.get("/product-photo/:id", productPhotoController);

//get Total number of products
router.get("/get-total", getTotalController);

//filter
router.post("/product-filters", productFiltersController);

//search product
router.get("/search-product/:keyword", searchProductController);

//similar product
router.get("/related-product/:prodId/:catId", realtedProductController);

//Payment
router.post("/checkout", requireSignIn, checkoutController);

//Payment
router.post("/verifypayment", requireSignIn, VerifyPaymentController);

//Review and Rating
router.put("/review/:prodId", requireSignIn, productReviewController);

export default router;
