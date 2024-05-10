import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import { instance } from "../routes/authRoute.js";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.send({ message: "Name Required" });
    }
    if (!description) {
      return res.send({ message: "Description Required" });
    }
    if (!price) {
      return res.send({ message: "Price Required" });
    }
    if (!category) {
      return res.send({ message: "Category Required" });
    }
    if (!quantity) {
      return res.send({ message: "Quantity Required" });
    }
    if (!photo && photo.size > 1000000) {
      return res.send({
        message: "photo Required and should be less than 1MB",
      });
    }
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(200).send({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await new productModel({
      name,
      description,
      price,
      category,
      quantity,
      photo,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getProductController = async (req, res) => {
  let { page } = req.params;
  try {
    page = parseInt(page, 10) || 1;
    let pageSize = 12;
    const products = await productModel
      .find({})
      .populate("category")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.status(201).send({
      success: true,
      message: "All products",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in loading all products",
    });
  }
};

//total products
export const getTotalController = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.status(201).send({
      success: true,
      message: "Getting Total number of products succesfully",
      total: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in counting products",
    });
  }
};
//Get details of single product
export const getSingleProductConteroller = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug: slug })
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Getting single product successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while loading product",
    });
  }
};

//Delete single product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    await productModel.findByIdAndDelete(id).select("-photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleteing product",
    });
  }
};

//get photo of a product
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while loading photo",
    });
  }
};

//getAllProductsController
export const getAllProductsController = async (req, res) => {
  let { page } = req.params;
  try {
    page = parseInt(page, 10) || 1;
    let pageSize = 12;
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.status(201).send({
      success: true,
      message: "All products",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in loading all products",
    });
  }
};

//update product

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.send({ message: "Name Required" });
    }
    if (!description) {
      return res.send({ message: "Description Required" });
    }
    if (!price) {
      return res.send({ message: "Price Required" });
    }
    if (!category) {
      return res.send({ message: "Category Required" });
    }
    if (!quantity) {
      return res.send({ message: "Quantity Required" });
    }
    if (photo && photo.size > 1000000) {
      return res.send({
        message: "photo Required and should be less than 1MB",
      });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        quantity,
        photo,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Searching Products",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { prodId, catId } = req.params;
    const products = await productModel
      .find({
        category: catId,
        _id: { $ne: prodId },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//Payment CheckOut controller
export const checkoutController = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

export const VerifyPaymentController = async (req, res) => {
  const { orderId, paymentId, signature, userId, cartId, address, amount } =
    req.body;
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === signature;
  let actualAmount = Number(amount / 100);
  try {
    if (isAuthentic) {
      // save order
      const cart = await cartModel
        .findOne({ user: userId })
        .populate({ path: "cartItems", populate: { path: "product" } });

      const details = await orderModel.create({
        cart: cart.cartItems,
        buyer: userId,
        payment: {
          orderId,
          paymentId,
          signature,
        },
        amount: actualAmount,
        address,
      });

      res.status(200).json({
        success: true,
        message: "order successfull",
        cartId: details.cart,
      });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// product rating and review
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    // find product
    const product = await productModel.findById(req.params.prodId);

    // check previous review
    const alreadyReviewed = product?.review?.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Alredy Reviewed",
      });
    }

    // review object
    const review = {
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product?.review?.push(review);
    // number or reviews
    product.numReviews = product?.review?.length;
    product.rating =
      product?.review?.reduce((acc, item) => item.rating + acc, 0) /
      product?.review?.length;
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added!",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Review API",
      error,
    });
  }
};
