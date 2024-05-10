import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart.js";
import { useAuth } from "../context/auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import getAllCart from "../components/Layout/getAllCart.js";
import Badge from "react-bootstrap/esm/Badge.js";
import { FaCirclePlus } from "react-icons/fa6";
import { FaMinusCircle } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import { FaRupeeSign } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Spinner from "../components/Spinner.js";

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart, cartId, setCartId] = useCart();
  const [address, setaddress] = useState("");
  const [allAddress, setAllAddress] = useState([]);

  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        return (total = total + item.product.price * item.quantity);
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  };
  //remove item
  const removeCartItem = async (prodId) => {
    const userId = auth?.user._id;
    try {
      const { data } = await axios.post(`/api/v1/cart/remove-from-cart`, {
        userId,
        prodId,
      });
      if (data) {
        toast.success(data.message);
        getAllCart(auth, setCart, setCartId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Load all address
  const getAllAddress = async () => {
    const email = auth?.user?.email;
    try {
      const res = await axios.get(`/api/v1/auth/get-address/${email}`);
      if (res.data?.success) {
        setAllAddress(res.data.address);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while loading address");
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getAllCart(auth, setCart, setCartId);
    }
  }, []);

  useEffect(() => {
    if (auth?.user?.email) {
      getAllAddress();
    }
  }, [auth?.user]);

  ////handle Add To Cart
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  //reduce quantity
  const reduceCartQuantity = async (prodId) => {
    const userId = auth?.user._id;
    try {
      const { data } = await axios.post(`/api/v1/cart/reduce-cart`, {
        userId,
        prodId,
      });
      if (data) {
        toast.success(data.message);
        getAllCart(auth, setCart, setCartId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle checkout
  const handleCheckOut = async () => {
    let amount = totalPrice();
    let user = auth?.user;
    try {
      const {
        data: { key },
      } = await axios.get("/api/v1/auth/getkey");

      const {
        data: { order },
      } = await axios.post("/api/v1/product/checkout", {
        amount,
      });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: auth?.user?.name,
        description: "test checkout",
        image: "",
        order_id: order.id,
        handler: function (response) {
          saveOrder(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            order.amount
          );
        },
        // callback_url: "http://localhost:8080/api/v1/product/verifypayment",
        prefill: {
          name: auth?.user.name,
          contact: auth?.user.mobile,
          email: auth?.user.email,
        },
        notes: {
          address: address,
        },
        theme: {
          color: "#BE4BA9",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
    }
  };

  //save order
  const saveOrder = async (paymentId, orderId, signature, amount) => {
    const userId = auth?.user._id;
    try {
      const { data } = await axios.post(`/api/v1/product/verifypayment`, {
        userId,
        cartId,
        paymentId,
        orderId,
        signature,
        address,
        amount,
      });

      if (data.success) {
        toast.success(data.message);
        deleteCart(cartId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete cart
  const deleteCart = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/cart/delete-cart/${id}`);

      if (data.success) {
        navigate("/dashboard/user/orders");
        getAllCart(auth, setCart, setCartId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {auth?.token ? (
        <div className="container">
          {cart?.length ? (
            <div className="row">
              <div className="col-md-8">
                <h4 className="text-center mt-3">
                  {cart?.length ? null : " Your Cart Is Empty"}
                </h4>

                {cart?.map((p) => (
                  <div key={p._id} className="row mb-2 p-3 card flex-row">
                    <div className="col-md-4">
                      <img
                        src={`/api/v1/product/product-photo/${p.product._id}`}
                        className="card-img-top"
                        alt={p.product.name}
                        width="200px"
                        height={"200px"}
                      />
                    </div>
                    <div className="col-md-8">
                      <p className="fs-4 fw-semibold">{p.product.name}</p>
                      <p className="fs-5">
                        {p.product.description.substring(0, 30)}...
                      </p>
                      <p className="fs-5">
                        Price : <FaRupeeSign />
                        {p.product.price}
                      </p>
                      <p className="fs-4 fw-semibold">
                        <FaMinusCircle
                          className="m-2"
                          onClick={(e) => {
                            reduceCartQuantity(p.product._id);
                          }}
                        />
                        <Badge pill bg="info">
                          {p.quantity}
                        </Badge>

                        <FaCirclePlus
                          className="m-2"
                          onClick={(e) => {
                            handleAddToCart(p.product._id);
                          }}
                        />
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(p.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-4 text-center border mt-3">
                <h2>Cart Summary</h2>
                <p>Total | Checkout | Payment</p>
                <hr />
                <Table hover className="text-start">
                  <tbody>
                    <tr className="fs-5 fw-semibold">
                      <td>Price({cart.length})</td>
                      <td>
                        <FaRupeeSign />
                        {totalPrice()}
                      </td>
                    </tr>
                    <tr className="fs-5 fw-semibold">
                      <td>Shipping</td>
                      <td>
                        <FaRupeeSign />
                        Free
                      </td>
                    </tr>
                    <tr className="fs-4 fw-bold">
                      <td>Total</td>
                      <td>
                        <FaRupeeSign />
                        {totalPrice()}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="mb-3 text-center w-100">
                  <h4 className="text-primary fs-4 fw-semibold">
                    {allAddress.length > 0
                      ? "Select delivery Address"
                      : "Add delivery address"}
                  </h4>
                  {allAddress.map((item, index) => {
                    return (
                      <div key={index} className="border">
                        <Form.Check // prettier-ignore
                          id="custom-switch"
                          type="radio"
                          label={item}
                          value={item}
                          name="group1"
                          className="fs-5 text-center "
                          onChange={(e) => {
                            setaddress(e.target.value);
                          }}
                        ></Form.Check>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <Link to="/dashboard/user/manage-address">
                    <button className="btn btn-outline-warning m-1 w-50">
                      {allAddress.length > 0 ? "Update Address" : "Add address"}
                    </button>
                  </Link>
                </div>

                {address ? (
                  <button
                    className="btn btn-warning m-1 w-50 mb-3"
                    onClick={() => {
                      handleCheckOut();
                    }}
                  >
                    checkout
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <h4 className="text-center mt-3">Your Cart Is Empty</h4>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Cart;
