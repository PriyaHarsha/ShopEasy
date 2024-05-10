import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/serach";
import { NavLink } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";

const Search = () => {
  const [values, setValues] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center mt-4">
          <h1>Search Results</h1>
          <div className="d-flex flex-wrap mt-4 justify-content-center align-items-center">
            <h3>{values?.results.length < 1 ? "No Products Found" : null}</h3>
            {values?.results.map((p) => (
              <div key={p._id}>
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top object-fit-contain"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text">
                      <FaRupeeSign /> {p.price}
                    </p>
                    <NavLink to={`/product-detail/${p.slug}`}>
                      <button className="btn btn-primary ms-1 w-75">
                        More Details
                      </button>
                    </NavLink>

                    <button className="btn btn-secondary m-1 w-75">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
