import React from "react";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

const ForgetPW = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const [newpassword, setNewPassword] = useState("");
  const [showOtpBar, setShowOtpBar] = useState(false);
  const navigate = useNavigate();

  //Submit function
  const generateOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forget-pw", {
        email,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowOtpBar(true);
      } else if (res.status === 201) {
        toast.error(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/v1/auth/reset-pw", {
        email,
        otp,
        newpassword,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 404) {
        setTimeout(() => {
          navigate("/register");
        });
      }
    }
  };
  return (
    <Layout title="Forget password-Shop Easy">
      <div className="form-container">
        <h1>Shop Easy</h1>
        {showOtpBar ? (
          <>
            <form className="form" onSubmit={handleSubmit}>
              <h2 className="p1">Enter OTP</h2>
              <div className="mb-3">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Set New Password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </>
        ) : (
          <form className="form" onSubmit={generateOTP}>
            <h2>Enter registered Email</h2>
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

            <button type="submit" className="btn btn-primary">
              Generate OTP
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ForgetPW;
