import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [shipping, setShipping] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

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
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const product = new FormData();

    product.append("name", name);
    product.append("description", description);
    product.append("price", price);
    product.append("quantity", quantity);
    product.append("photo", photo);
    product.append("category", selectedCategory);

    try {
      const res = await axios.post("/api/v1/product/create-product", product);

      if (res.data?.success) {
        toast.success(`Product - ${name} is created succesfully`);
        setTimeout(() => {
          navigate("/dashboard/admin/all-products");
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while creating product");
    }
    setName("");
  };

  return (
    <Layout title={"create-product- Shop Easy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <AdminMenu />
        </div>
        <div className="row">
          <div className="m-3 border p-3 text-center">
            <h1>Create New product</h1>

            <Form onSubmit={handleCreateProduct}>
              <Form.Select
                size="lg"
                aria-label="Default select example"
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="m-1 "
              >
                <option value="" selected disabled hidden>
                  Select Category
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

              <label className="btn btn-secondary w-75 mt-3 m-1">
                {!photo ? "Upload Image" : photo.name}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                  className=""
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
                ) : null}
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
                className="mt-3"
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Enter Quantity"
                value={quantity}
                className="mt-3"
                onChange={(e) => setQuantity(e.target.value)}
              />
              {/* <Form.Select
                size="lg"
                aria-label="Default select example"
                placeholder="Select Shipping"
                onChange={(e) => setShipping(e.target.value)}
                className="mt-3 w-75"
              >
                <option value="" disabled selected hidden>
                  Select Shipping
                </option>
                <option>Yes</option>
                <option>No</option>
              </Form.Select> */}
              <Button variant="primary" type="submit" className="mt-3 w-75">
                Create Product
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
