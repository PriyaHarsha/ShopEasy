import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import getAllCart from "../components/Layout/getAllCart.js";
import { useCart } from "../context/Cart.js";
import { Rating } from "react-simple-star-rating";
import { imagefrombuffer } from "imagefrombuffer";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [category, setCategory] = useState("");
  const params = useParams();
  const [auth] = useAuth();
  const [cart, setCart, cartId, setCartId] = useCart();

  //initalp details
  useEffect(() => {
    if (params?.slug) getsingleProduct();
  }, [params?.slug]);

  //get product
  const getsingleProduct = async () => {
    const slug = params.slug;
    try {
      const res = await axios.get(`/api/v1/product/get-single-product/${slug}`);
      if (res?.data?.success) {
        setProduct(res.data.product);
        setCategory(res.data.product.category.name);
        getSimilarProduct(res.data.product._id, res.data.product.category._id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //get similar product
  const getSimilarProduct = async (prodId, catId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${prodId}/${catId}`
      );
      setRelatedProducts(data?.products);
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
  return (
    <Layout title={"Product Detail - Shop Easy"}>
      <div
        className="d-flex justify-content-center container-fluid border row m-3"
        id="details"
      >
        {product && (
          <>
            <div className="col-sm-4 m-4">
              <Image
                src={imagefrombuffer({
                  type: product.photo?.contentType,
                  data: product.photo?.data.data,
                })}
                // src={`/api/v1/product/product-photo/${product._id}`}
                fluid
                style={{ width: "400px", height: "400px" }}
              />
            </div>
            <div className="col-lg-6 m-3 border w-45">
              <div className="d-flex flex-column flex-wrap">
                <h5 className="text-secondary">{category}</h5>
                <p className="fw-bold fs-4">{product.name}</p>
                <Rating
                  initialValue={product.rating}
                  size={25}

                  /* Available Props */
                />

                <div className="text-body-emphasis fs-4">
                  {product.description}
                </div>

                <div className="text-body-emphasis fs-4 mt-2">
                  <FaRupeeSign /> {product.price}
                </div>

                <p className="text-success fs-5 fw-bold mt-2">
                  {product?.quantity > 0 ? "In stock" : "Out of Stock"}
                </p>

                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className=" w-50 mt-2"
                    onClick={() => {
                      handleAddToCart(product._id);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
            <div>
              {product?.review?.length > 0 ? (
                <>
                  <p className="fw-bold fs-4">Top Reviews:</p>
                  {product.review &&
                    product?.review.map((r) => {
                      return (
                        <div key={r._id} className="border-dark">
                          <Rating initialValue={r.rating} size={25} />
                          <p> {r.comment}</p>
                        </div>
                      );
                    })}
                </>
              ) : null}
            </div>

            <hr />

            <div className="row container m-3 text-center">
              <h3>Similar Products</h3>
              {relatedProducts.length < 1 && (
                <p className="text-center">No Similar Products found</p>
              )}
              <div className="d-flex flex-wrap justify-content-center text-center">
                {relatedProducts &&
                  relatedProducts?.map((prod) => (
                    <Card
                      key={prod._id}
                      className="m-3 position-relative"
                      style={{ width: "17rem", height: "20rem" }}
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
                          <Card.Title>{prod.name}</Card.Title>
                          <Card.Text>
                            <FaRupeeSign />
                            {prod.price}
                          </Card.Text>
                        </Card.Body>
                      </Link>

                      <div className=" mb-3 position-absolute bottom-0 w-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            handleAddToCart(prod._id);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
