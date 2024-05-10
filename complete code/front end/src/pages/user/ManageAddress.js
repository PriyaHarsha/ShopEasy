import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.js";
import { useAuth } from "../../context/auth.js";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import UsersMenu from "../../components/Layout/UsersMenu.js";

const ManageAddress = () => {
  const [auth] = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [address, setAddress] = useState("");
  const [newaddress, setNewaddress] = useState("");
  const [modalShow1, setModalShow1] = useState("");
  const [index, setIndex] = useState("");

  //Add new address
  const addAddress = async (e) => {
    e.preventDefault();
    const email = auth?.user?.email;
    const newaddress = { address: address };
    try {
      const res = await axios.put(`/api/v1/auth/add-address`, {
        email,
        newaddress,
      });
      if (res.data?.success) {
        toast.success(`address added successfully`);
        setModalShow(false);
        getAllAddress();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while adding address");
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
    getAllAddress();
    //eslint-disable-next-line
  }, []);

  //handle delete
  const handleDelete = async (addr) => {
    const email = auth?.user?.email;
    try {
      const res = await axios.put(`/api/v1/auth/delete-address`, {
        addr,
        email,
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        getAllAddress();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in deleting category");
    }
  };

  //handle edit
  const handleUpdate = async () => {
    const email = auth?.user?.email;

    try {
      const res = await axios.put(`/api/v1/auth/update-address`, {
        newaddress,
        email,
        index,
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        getAllAddress();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in updating category");
    }
  };
  return (
    <Layout title={"dash board-Shop Easy"}>
      <div className="container-fluid m-3  ">
        <div className="row ">
          <UsersMenu name={auth?.user?.name} />
        </div>
        <div className="row ">
          <div className="border text-center m-3 ">
            <h2>Manage Address</h2>
            <div className="d-flex flex-wrap justify-content-center">
              {allAddress.map((addr, index) => {
                return (
                  <Card
                    key={index}
                    className="m-3 position-relative"
                    style={{ width: "18rem", height: "12rem" }}
                  >
                    <Card.Body>
                      <Card.Text>{addr}</Card.Text>
                      <div className="position-absolute bottom-0 text-center mb-2 ms-4">
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            setModalShow1(true);
                            setNewaddress(addr);
                            setIndex(index);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="lg"
                          className="delete-product"
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "Do you really want to delete this address?"
                            );
                            if (confirmBox === true) {
                              handleDelete(addr);
                            }
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

          <div className="m-3 text-center">
            <Button
              variant="primary"
              onClick={(e) => {
                setModalShow(true);
              }}
            >
              Add New address
            </Button>
          </div>

          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton></Modal.Header>
            <div className="m-5 text-center">
              <input
                type="text"
                className="form-control"
                placeholder="Enter New address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Button
                className="mt-3"
                variant="primary"
                onClick={(e) => {
                  addAddress(e);
                }}
              >
                Add
              </Button>
            </div>
          </Modal>

          <Modal
            show={modalShow1}
            onHide={() => setModalShow1(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton></Modal.Header>
            <div className="m-5 text-center">
              <input
                type="text"
                className="form-control"
                placeholder="Enter New address"
                value={newaddress}
                onChange={(e) => setNewaddress(e.target.value)}
                required
              />
              <Button
                className="mt-3"
                variant="primary"
                onClick={(e) => {
                  handleUpdate(e);
                  setModalShow1(false);
                }}
              >
                Update
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAddress;
