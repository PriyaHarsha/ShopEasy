import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">Login to access this page</h1>
        <h1 className="Text-center">Redirecting to Login in {count} seconds</h1>
        <button className="btn btn-primary" type="button" disabled>
          <span role="status">Loading...</span>
          <span className="spinner-grow spinner-grow-sm" aria-hidden="true" />
        </button>
      </div>
    </>
  );
};

export default Spinner;
