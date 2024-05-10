import cartModel from "../models/cartModel.js";

export const addToCartController = async (req, res) => {
  try {
    const { userId, prodId } = req.body;

    const existingCart = await cartModel
      .findOne({ user: userId })
      .populate("cartItems");

    if (existingCart) {
      const existingProduct = existingCart.cartItems.findIndex(
        (item) => item.product._id == prodId
      );

      if (existingProduct !== -1) {
        const updatedProduct = await cartModel.findOneAndUpdate(
          {
            user: userId,
            "cartItems.product": prodId,
          },
          { $inc: { "cartItems.$.quantity": 1 } },

          { new: true }
        );
        res.status(200).json({
          message: "Product added to Cart",
          total: updatedProduct?.cartItems.length,
        });
      } else {
        const addNewProduct = await cartModel.findOneAndUpdate(
          { user: userId },
          { $push: { cartItems: { product: prodId } } },
          { new: true }
        );
        res.status(200).json({
          message: "Product added to Cart",
          total: addNewProduct?.cartItems?.length,
        });
      }
    } else {
      const product = await cartModel.create({
        user: userId,
        cartItems: [{ product: prodId }],
      });
      res.status(200).json({
        message: "Product added to Cart",
        total: product?.cartItems?.length,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding product to cart",
    });
  }
};

export const reduceCartController = async (req, res) => {
  try {
    const { userId, prodId } = req.body;
    console.log(userId, prodId);

    const existingCart = await cartModel.findOne({ user: userId });

    if (existingCart) {
      const existingProductIndex = existingCart.cartItems.findIndex(
        (item) => item.product._id == prodId
      );
      console.log(existingCart.cartItems[existingProductIndex]);

      if (existingCart.cartItems[existingProductIndex].quantity !== 1) {
        const updatedProduct = await cartModel.findOneAndUpdate(
          {
            user: userId,
            "cartItems.product": prodId,
          },
          { $inc: { "cartItems.$.quantity": -1 } },

          { new: true }
        );
        console.log(updatedProduct);
        res.status(200).json({
          message: "Item removed from cart",
          total: updatedProduct?.cartItems?.length,
        });
      } else {
        const updatedProduct = await cartModel.findOneAndUpdate(
          {
            user: userId,
            "cartItems.product": prodId,
          },
          { $pull: { cartItems: { product: prodId } } },
          { new: true }
        );
        console.log(updatedProduct);
        res.status(200).json({
          message: "Item removed from cart",
          total: updatedProduct?.cartItems?.length,
        });
      }
    } else {
      res.status(404);
      throw new Error("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while removing product from cart",
    });
  }
};

// get all elements from cart
export const getAllCartController = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingCart = await cartModel
      .findOne({ user: userId })
      .populate({ path: "cartItems", populate: { path: "product" } });

    if (existingCart) {
      res.status(200).send({
        message: "getting Cart succesfully",
        cart: existingCart,
      });
    } else {
      res.status(201).send({
        message: "cart empty",
        cart: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding product to cart",
    });
  }
};

//remove from cart
export const removeFromCartController = async (req, res) => {
  try {
    const { userId, prodId } = req.body;

    const existingCart = await cartModel.findOne({ user: userId });

    if (existingCart) {
      const updatedProduct = await cartModel.findOneAndUpdate(
        {
          user: userId,
          "cartItems.product": prodId,
        },
        { $pull: { cartItems: { product: prodId } } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product removed from cart",
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
      message: "Error while removing product from cart",
    });
  }
};

// get all cart id
export const getCartIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingCart = await cartModel.findOne({ user: userId });

    if (existingCart) {
      res.status(200).json({
        id: existingCart._id,
      });
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding product to cart",
    });
  }
};

//delete cart
export const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;
    await cartModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleteing Category",
    });
  }
};
