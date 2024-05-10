import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer p-3 ">
      <div className="d-flex justify-content-around">
        <div>
          <h4>About</h4>
          <ul className="list-unstyled list">
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about">About ShopEasy</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul className="list-unstyled list">
            <li>
              <Link>Payment Methods</Link>
            </li>

            <li>
              <Link>FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Mail US</h4>
          <ul className="list-unstyled list">
            <li>ShopEasy Pvt Limited</li>
            <li>Bangalore, Karnatka</li>
            <li>India-560043</li>
          </ul>
        </div>
      </div>
      <h4 className="text-center">All Right Reserved &copy; Priya-B-S</h4>
    </div>
  );
};

export default Footer;
