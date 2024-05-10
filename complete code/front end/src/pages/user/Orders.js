import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.js";
import { useAuth } from "../../context/auth.js";
import axios from "axios";
import UsersMenu from "../../components/Layout/UsersMenu.js";
import moment from "moment";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Rating } from "react-simple-star-rating";
import { FaRupeeSign } from "react-icons/fa";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [pointer, setPointer] = useState("");
  const [prodId, setProdId] = useState("");

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/get-user-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  //handle add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/product/review/${prodId}`, {
        comment,
        rating,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    console.log(rating);

    // other logic
  };

  const onPointerMove = (value, index) => {
    if (value > 0 && value < 2) {
      setPointer("Worst");
    } else if (value >= 2 && value < 4) {
      setPointer("Average");
    } else if (value >= 4 && value <= 5) {
      setPointer("Good");
    } else {
      setPointer("");
    }
  };

  const onPointerLeave = () => setPointer("");
  return (
    <Layout title={"Your Orders -Shop Easy"}>
      <div className="container-flui p-3 m-3 ">
        <div className="row">
          <UsersMenu />
        </div>
        <div className="row">
          <div>
            <h1 className="text-center">Order History</h1>
            <h3 className="d-flex justify-content-center">
              {orders.length > 0 ? "" : "No Orders Found"}
            </h3>

            {orders?.map((o, i) => {
              return (
                <div
                  key={o._id}
                  className="border  text-center table-responsive"
                >
                  <Table striped className="mt-1 table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>
                          {o?.payment.paymentId ? "Success" : "Failed"}
                          <p>{o?.payment.paymentId}</p>
                        </td>
                        <td>{o?.cart?.length}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="container">
                    {o?.cart?.map((p, i) => (
                      <div
                        className="row p-3 card flex-row"
                        key={p.product._id}
                      >
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p.product._id}`}
                            className="card-img-top object-fit-scale"
                            alt={p.product.name}
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                        <div className="col-md-8">
                          <p className="fs-4 fw-semibold mb-1">
                            {p.product.name}
                          </p>
                          <p className="fs-5 mb-1">
                            {p.product.description.substring(0, 30)}
                          </p>
                          <p className="fs-5 mb-1">
                            Price : <FaRupeeSign />
                            {p.product.price}
                          </p>
                          {o?.status == "Deliverd" ? (
                            <>
                              <div className="mb-3 text-center  w-100">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="mt-1 fs-5"
                                  onClick={(e) => {
                                    setProdId(p.product._id);
                                    setModalShow(true);
                                  }}
                                >
                                  Add Review
                                </Button>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <h4>Add Reveiw and Rating</h4>
          </Modal.Header>
          <div className="m-5">
            <div className="text-center">
              <h5 className="d-flex">
                Add Rating:
                <Rating
                  onClick={handleRating}
                  onPointerMove={onPointerMove}
                  onPointerLeave={onPointerLeave}
                />
                <p className="m-2 border bg-secondary p-1 rounded-pill">
                  {pointer}
                </p>
              </h5>

              <Form onSubmit={handleAddReview}>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Product Review"
                  className="mt-3"
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3 w-50 "
                  onClick={(e) => {
                    setModalShow(false);
                  }}
                >
                  Add
                </Button>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Orders;
