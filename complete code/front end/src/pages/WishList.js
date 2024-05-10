import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart.js";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import getAllCart from "../components/Layout/getAllCart.js";
import { FaRupeeSign } from "react-icons/fa";

import Spinner from "../components/Spinner.js";
import { useWishlist } from "../context/wishlist.js";
import getAllWishlist from "../components/Layout/getAllWishlist.js";

const WishList = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart, cartId, setCartId] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const navigate = useNavigate();

  //remove item from cart
  const removeWishlistItem = async (prodId) => {
    const userId = auth?.user._id;
    try {
      const { data } = await axios.post(
        `/api/v1/wishlist/remove-from-wishlist`,
        {
          userId,
          prodId,
        }
      );
      if (data) {
        toast.success(data.message);
        getAllWishlist(auth, setWishlist);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle Add To Cart
  const handleAddToCart = async (prodId) => {
    const userId = auth?.user._id;

    try {
      const { data } = await axios.post("/api/v1/cart/add-to-cart", {
        prodId,
        userId,
      });

      if (data) {
        toast.success(data.message);
        getAllCart(auth, setCart, setCartId);
        //navigate("/cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {auth?.token ? (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h4 className="text-center mt-3">
                {wishlist?.length ? null : " Your wishlist Is Empty"}
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-1">
              {wishlist?.map((p) => (
                <div key={p._id} className="row mb-2 p-3 card flex-row">
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p.product._id}`}
                      className="card-img-top object-fit-contain"
                      alt={p.product.name}
                      width="200px"
                      height={"200px"}
                    />
                  </div>
                  <div className="col-md-8">
                    <p className="fs-4 fw-semibold">{p.product.name}</p>
                    <p className="fs-5">{p.product.description}</p>
                    <p className="fs-5">
                      Price : <FaRupeeSign />
                      {p.product.price}
                    </p>
                    <p className="text-success fs-4 fw-bold">
                      {p.product.quantity > 0 ? "In stock" : "Out of Stock"}
                    </p>

                    <button
                      className="btn btn-danger m-1"
                      onClick={() => removeWishlistItem(p.product._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-secondary m-1"
                      onClick={() => {
                        removeWishlistItem(p.product._id);
                        handleAddToCart(p.product._id);
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default WishList;
