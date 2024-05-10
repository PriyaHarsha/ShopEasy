import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/auth";
import UsersMenu from "../../components/Layout/UsersMenu.js";
import AdminMenu from "./AdminMenu.js";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const Details = () => {
  const [auth, setAuth] = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [email, setEmail] = useState();
  const [name, setName] = useState(auth.user.name);
  const [mobile, setMobile] = useState(auth.user.mobile);

  useEffect(() => {
    setEmail(auth.user.email);
    setName(auth.user.name);
    setMobile(auth.user.mobile);
  }, [auth?.user, auth]);

  //handle update
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/v1/auth/update-profile`, {
        email,
        name,
        mobile,
      });
      if (res.data?.success) {
        setAuth({ ...auth, user: res?.data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = res.data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="container-fluid m-3 p-3">
      <div className="row ">
        {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
      </div>
      <div className="row text-center m-3">
        <h3>Your Profile</h3>
        <div className="border p-3 m-3">
          <h4>
            Name: <span className="normal-text">{auth?.user?.name}</span>
          </h4>

          <h4 className="text-break">
            email:
            <span className="normal-text text-wrap">{auth?.user?.email}</span>
          </h4>
          <h4>
            mobile:
            <span className="normal-text">{auth?.user?.mobile}</span>
          </h4>

          <Button
            variant="primary"
            onClick={(e) => {
              setModalShow(true);
            }}
          >
            Edit Profile
          </Button>
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
        <div className="m-5 text-center">
          <InputGroup size="lg" className="mb-3 w-100">
            <InputGroup.Text id="inputGroup-sizing-lg">Name</InputGroup.Text>
            <Form.Control
              type="text"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup size="lg" className="mb-3 w-100">
            <InputGroup.Text id="inputGroup-sizing-lg">Email</InputGroup.Text>
            <Form.Control
              type="email"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup size="lg" className="mb-3 w-100">
            <InputGroup.Text id="inputGroup-sizing-lg">
              Mobile Number
            </InputGroup.Text>
            <Form.Control
              type="text"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </InputGroup>

          <Button
            className="mt-3"
            variant="primary"
            onClick={(e) => {
              handleUpdate();
              setModalShow(false);
            }}
          >
            Update
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Details;
