import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Prices } from "../components/Layout/Prices.js";
import toast from "react-hot-toast";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { useAuth } from "../context/auth.js";
import { useCart } from "../context/Cart.js";
import getAllCart from "../components/Layout/getAllCart.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { useWishlist } from "../context/wishlist.js";
import getAllWishlist from "../components/Layout/getAllWishlist.js";
import { Rating } from "react-simple-star-rating";
import hero from "../assets/hero.png";

const Home = () => {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(1);
  const [nodata, setNodata] = useState(false);
  const [cart, setCart, cartId, setCartId] = useCart();
  const [wishlist, setWishlist] = useWishlist("");
  const navigate = useNavigate();
  const location = useLocation();

  let items = [];
  for (let number = 1; number <= Math.ceil(total / 12); number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={(e) => {
          setActive(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  //Load all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/v1/category/getall-category");

      if (res?.data?.success) {
        setCategories(res.data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-all-products/${active})`
      );
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [active]);

  //get Total
  const getTotal = async () => {
    try {
      const res = await axios.get("/api/v1/product/get-total");
      if (res?.data?.success) {
        setTotal(res.data.total);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((cat) => cat !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      setTotal(0);
      filterProduct();
    } else {
      getAllProducts();
      getTotal();
    }
  }, [checked, radio]);

  //get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });

      data.products.length < 1 ? setNodata(true) : setNodata(false);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  //handle Add To Cart
  const handleAddToCart = async (prodId) => {
    if (!auth?.user) {
      navigate("/login");
    }
    const userId = auth?.user?._id;

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

  //handle Add To wishlist
  const handleAddToWishlist = async (prodId) => {
    if (!auth?.user) {
      navigate("/login");
    }
    const userId = auth?.user?._id;

    try {
      const { data } = await axios.post("/api/v1/wishlist/add-to-wishlist", {
        prodId,
        userId,
      });

      if (data) {
        toast.success(data.message);
        getAllWishlist(auth, setWishlist);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Shop Easy - Home"}>
      <div>
        <Card.Img
          variant="top"
          className="object-fit-cover mt-2"
          src={hero}
          style={{ width: "100vw", height: "30vh" }}
        />
      </div>

      <div className=" container-fluid row mt-3 justify-content-center">
        <div className="col-sm-2 m-3 p-3 border border-dark">
          <h4 className="text-center border-bottom border-dark">Filter</h4>
          <h6 className="text-center ">CATEGORIES</h6>
          <div className="d-flex flex-column">
            {categories?.map((cat) => (
              <Form.Check // prettier-ignore
                key={cat._id}
                type="checkbox"
                label={cat.name}
                value={cat.name}
                onChange={(e) => {
                  handleFilter(e.target.checked, cat._id);
                }}
              ></Form.Check>
            ))}
          </div>
          <h6 className="text-center mt-4">PRICE</h6>

          <div className="d-flex flex-column">
            {Prices?.map((price) => (
              <div key={price._id}>
                <Form.Check // prettier-ignore
                  type="radio"
                  id="custom-switch"
                  label={price.name}
                  value={price.array}
                  name="group1"
                  onChange={(e) => {
                    setRadio(e.target.value.split(","));
                  }}
                ></Form.Check>
              </div>
            ))}
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger m-3"
              onClick={() => window.location.reload()}
            >
              Clear All Filters
            </button>
          </div>
        </div>
        <div className="col-sm-8 border m-3 w-95 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((prod) => (
              <Card
                key={prod._id}
                className="m-2 text-center"
                style={{ width: "15rem", height: "20rem" }}
              >
                <Link
                  key={prod._id}
                  to={`/product-detail/${prod.slug}`}
                  className="product-link"
                >
                  <Card.Img
                    variant="top"
                    className="object-fit-contain mt-2"
                    src={`/api/v1/product/product-photo/${prod._id}`}
                    style={{ width: "150px", height: "150px" }}
                  />

                  <Card.Body>
                    <Card.Title className="fs-6 fw-semibold mb-1">
                      {prod.name}
                    </Card.Title>

                    <Rating
                      initialValue={prod.rating}
                      readonly={true}
                      size={12}
                      className="fs-6 fw-semibold mt-0"
                      /* Available Props */
                    />

                    <div className="d-flex justify-content-between">
                      <Card.Text>
                        Price: <FaRupeeSign />
                        {prod.price}
                      </Card.Text>
                      <Card.Text className="text-success fs-6 fw-bold m-0">
                        {prod.quantity > 0 ? "In stock" : "Out of Stock"}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Link>

                <div className="mb-3 text-center position-absolute bottom-0 w-100">
                  {prod.quantity > 0 ? (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="m-1 "
                        onClick={(e) => {
                          {
                            !auth?.user
                              ? navigate(`/login`)
                              : handleAddToWishlist(prod._id);
                          }
                        }}
                      >
                        Add to Wishlist
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="m-1 "
                        onClick={() => {
                          handleAddToCart(prod._id);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="info" disabled>
                      currenty Unavailable
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div>
            {nodata ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "30vw" }}
              >
                <h2>No data found</h2>
              </div>
            ) : null}
          </div>
          <div className="d-flex justify-content-center">
            <Pagination>{items}</Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
