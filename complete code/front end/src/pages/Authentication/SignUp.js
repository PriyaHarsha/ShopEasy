import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  //Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (password.match(check)) {
      try {
        const res = await axios.post("/api/v1/auth/register", {
          name,
          email,
          password,
          mobile,
          address,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          setTimeout(() => {
            navigate("/login");
          });
        } else if (res.status === 201) {
          toast.error(res.data.message);
          setTimeout(() => {
            navigate("/login");
          });
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      setShow(true);
    }
  };
  return (
    <Layout title={"SignUp - Shop Easy"}>
      <div className=" d-flex justify-content-center">
        <form className="form m-3 p-5 " onSubmit={handleSubmit}>
          <h3 className="form-title mt-0 p-0">Sign Up</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-danger">
              {show
                ? "Password length must be greater than 8 and contain atleast one number, one character and one symbol"
                : ""}
            </p>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
