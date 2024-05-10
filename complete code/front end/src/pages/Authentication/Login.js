import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "./auth.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useAuth();

  //Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
        setEmail("");
        setPassword("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Layout>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>

          <p className="reset-password">
            <NavLink to="/forgetPW">Forget Password</NavLink>
          </p>
          <p>
            Don't have an account?
            <span className="fw-bold">
              <NavLink to="/register"> Sign Up</NavLink>
            </span>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
