import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AdminMenu = () => {
  const [auth] = useAuth();
  return (
    <>
      <div className="text-center">
        <div className="d-flex justify-content-center bg-secondary-subtle">
          <NavLink
            to="/dashboard/admin"
            className="list-group-item list-group-item-action p-3"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-catagory"
            className="list-group-item list-group-item-action p-3"
          >
            Manage Catagory
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action p-3"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/all-products"
            className="list-group-item list-group-item-action p-3"
          >
            All Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action p-3"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
