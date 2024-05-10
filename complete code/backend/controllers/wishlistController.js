import cartModel from "../models/cartModel.js";
import wishlistModel from "../models/wishlistModel.js";

export const addToWishlistController = async (req, res) => {
  try {
    const { userId, prodId } = req.body;

    const existingWishlist = await wishlistModel
      .findOne({ user: userId })
      .populate("wishlistItems");

    if (existingWishlist) {
      const existingProduct = existingWishlist.wishlistItems.findIndex(
        (item) => item.product._id == prodId
      );
      if (existingProduct !== -1) {
        res.status(201).json({
          message: "Product already exist in whishlist",
        });
      } else {
        const addNewProduct = await wishlistModel.findOneAndUpdate(
          { user: userId },
          { $push: { wishlistItems: { product: prodId } } },
          { new: true }
        );
        res.status(200).json({
          message: "Product added to whishlist",
          total: addNewProduct?.wishlistItems?.length,
        });
      }
    } else {
      const product = await wishlistModel.create({
        user: userId,
        wishlistItems: [{ product: prodId }],
      });
      res.status(200).json({
        message: "Product added to Whislist",
        total: product?.wishlistItems?.length,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding product to wishlist",
    });
  }
};

// get all elements from wishlist
export const getAllWishlistController = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingWishlist = await wishlistModel
      .findOne({ user: userId })
      .populate({ path: "wishlistItems", populate: { path: "product" } });

    if (existingWishlist) {
      res.status(200).json({
        message: "getting whishlist succesfully",
        wishlist: existingWishlist.wishlistItems,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding product to wishlist",
    });
  }
};

export const removeFromWishlistController = async (req, res) => {
  try {
    const { userId, prodId } = req.body;

    const existingWishlist = await wishlistModel.findOne({ user: userId });

    if (existingWishlist) {
      const updatedProduct = await wishlistModel.findOneAndUpdate(
        {
          user: userId,
          "wishlistItems.product": prodId,
        },
        { $pull: { wishlistItems: { product: prodId } } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        total: updatedProduct?.cartItems?.length,
      });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while removing product from wishlist",
    });
  }
};
