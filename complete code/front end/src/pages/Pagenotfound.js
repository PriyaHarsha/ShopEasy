import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import pnf from "../assets/pnf.jpg";

const Pagenotfound = () => {
  return (
    <Layout title={"Page not Found- Shop Easy"}>
      <div className="pnf">
        <div className="pnf-detail">
          <h1 className="pnf-title">Oops!</h1>
          <h2 className="pnf-heading">
            The page you are looking for does't exists
          </h2>
          <Link to="/" className="pnf-btn">
            Go Back
          </Link>
        </div>
        <img className="pnf-image" src={pnf} alt="Page_Not_FOund"></img>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
