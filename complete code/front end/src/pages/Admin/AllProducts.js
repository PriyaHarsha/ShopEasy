import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import { imagefrombuffer } from "imagefrombuffer";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(1);
  const [total, setTotal] = useState(0);
  const [prodId, setProdId] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  //const [photo, setPhoto] = useState("");

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

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-products/${active})`
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
    getTotal();
    //eslint-disable-next-line
  }, []);

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

  useEffect(() => {
    getAllProducts();
  }, [active]);

  //handle delete
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/product/delete-product/${id}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        getAllProducts();
        setModalShow(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in deleting category");
    }
  };

  return (
    <Layout title={"All-Products- Shop Easy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <AdminMenu />
        </div>
        <div className="row m-3">
          <div className="text-center border ">
            <h1>All Products</h1>
            <div className="d-flex flex-wrap justify-content-center">
              {products &&
                products.map((prod) => {
                  return (
                    <Card
                      key={prod?._id}
                      className="m-1 text-center"
                      style={{ width: "19rem", height: "30rem" }}
                    >
                      <div className="text-center">
                        <Card.Img
                          variant="top"
                          src={imagefrombuffer({
                            type: prod.photo?.contentType,
                            data: prod.photo?.data.data,
                          })}
                          className="object-fit-contain mt-2"
                          alt={prod.name}
                          style={{ width: "150px", height: "150px" }}
                        />
                      </div>

                      <Card.Body>
                        <Card.Title>{prod.name}</Card.Title>
                        <Card.Text>
                          {prod.description.substring(0, 100)}...
                        </Card.Text>
                        <Card.Text>Price: {prod.price} INR</Card.Text>
                        <Card.Text>
                          Available Quantity: {prod.quantity}
                        </Card.Text>
                        <div className=" text-center">
                          <Link
                            key={prod._id}
                            to={`/dashboard/admin/all-products/${prod.slug}`}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-primary ms-2"
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={(e) => {
                              setModalShow(true);
                              setProdId(prod._id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Pagination>{items}</Pagination>
          </div>
        </div>
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <div className="m-5">
            <h3>Are you sure you want to delete Category</h3>
            <button
              className="btn btn-danger p-2 m-2"
              onClick={(e) => {
                setModalShow(false);
              }}
            >
              No
            </button>
            <button
              className="btn btn-danger p-2 m-2"
              onClick={(e) => {
                handleDelete(prodId);
              }}
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AllProducts;
