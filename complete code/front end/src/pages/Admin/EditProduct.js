import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [catName, setCatName] = useState("");
  const [category, setCategory] = useState("");
  const { slug } = useParams();
  const [productId, setProductId] = useState("");

  const navigate = useNavigate();

  //get product using slug
  const getProduct = async () => {
    try {
      const res = await axios.get(`/api/v1/product/get-single-product/${slug}`);

      if (res?.data?.success) {
        setName(res.data.product.name);
        setDescription(res.data.product.description);
        setPrice(res.data.product.price);
        setQuantity(res.data.product.quantity);
        setProductId(res.data.product._id);
        setCategory(res.data.product.category._id);
        setCatName(res.data.product.category.name);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while loading product details");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const product = new FormData();
    product.append("name", name);
    product.append("description", description);
    product.append("price", price);
    product.append("quantity", quantity);
    photo && product.append("photo", photo);
    product.append("category", category);

    try {
      const res = await axios.put(
        `/api/v1/product/update-product/${productId}`,
        product
      );
      if (res.data?.success) {
        toast.success(`Product - ${name} is updated succesfully`);
        setTimeout(() => {
          navigate("/dashboard/admin/all-products");
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while updating product");
    }
  };

  //Load all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/v1/category/getall-category");

      if (res?.data?.success) {
        setCategories(res?.data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllCategory();
    // eslint-disable-next-line
  }, []);
  return (
    <Layout title={"update-product- Shop Easy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <AdminMenu />
        </div>
        <div className="row m-3 text-center">
          <div className=" border p-3">
            <h1>Update product</h1>

            <Form onSubmit={handleUpdateProduct}>
              <Form.Select
                size="lg"
                aria-label="Default select example"
                onChange={(e) => setCategory(e.target.value)}
                className="m-1 "
              >
                <option value={category} selected disabled hidden>
                  {catName}
                </option>
                {categories &&
                  categories.map((cat) => {
                    return (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    );
                  })}
              </Form.Select>

              <label className="btn btn-secondary mt-3 m-1">
                {!photo ? "Upload Image" : photo.name}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                ></input>
              </label>

              <div className="text-center">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_image"
                    height={"200px"}
                    className="img img-responsive"
                  />
                ) : (
                  <img
                    src={`/api/v1/product/product-photo/${productId}`}
                    alt="product_image"
                    height={"200px"}
                    className="img img-responsive"
                  />
                )}
              </div>

              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                value={name}
                className="mt-3"
                onChange={(e) => setName(e.target.value)}
              />

              <Form.Control
                as="textarea"
                placeholder="Enter Product Description"
                value={description}
                className="mt-3"
                onChange={(e) => setDescription(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                className="mt-3 "
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Enter Quantity"
                value={quantity}
                className="mt-3 "
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Button variant="primary" type="submit" className="mt-3 ">
                Update Product
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
