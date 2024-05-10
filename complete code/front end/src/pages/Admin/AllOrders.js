import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import Form from "react-bootstrap/Form";

const AllOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Deliverd",
    "cancel",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/get-all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All-orders- Shop Easy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <AdminMenu />
        </div>
        <div className="row">
          <div>
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div key={o._id} className="border table-responsive mb-4">
                  <table className="table text-center">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Form.Select
                            onChange={(e) =>
                              handleChange(o._id, e.target.value)
                            }
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <option key={i} value={s}>
                                {s}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>
                          {o?.payment.paymentId ? "Success" : "Failed"}
                          <p>{o?.payment.paymentId}</p>
                        </td>
                        <td>{o?.cart?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.cart?.map((p, i) => (
                      <div
                        className="row mb-2 p-3 flex-row"
                        key={p.product._id}
                      >
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p.product._id}`}
                            className="card-img-top object-fit-contain"
                            alt={p.product.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p className="fs-4 fw-semibold">{p.product.name}</p>
                          <p>{p.product.description.substring(0, 30)}...</p>
                          <p className="fs-5 ">Price : {p.product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
