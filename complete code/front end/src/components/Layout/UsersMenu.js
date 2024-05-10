import React from "react";
import { NavLink } from "react-router-dom";

const UsersMenu = () => {
  return (
    <>
      <div className="text-center ">
        <div className="d-flex justify-content-center bg-secondary-subtle">
          {/* <NavLink
            to="/dashboard/user"
            exact
            className="list-group-item list-group-item-action p-3"
          >
            <div>Dashboard</div>
          </NavLink> */}
          <NavLink
            to="/dashboard/user/manage-address"
            className="list-group-item list-group-item-action p-3"
          >
            Manage Address
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action p-3"
          >
            Your orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UsersMenu;
