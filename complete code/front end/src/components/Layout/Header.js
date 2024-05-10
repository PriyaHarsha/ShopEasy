import React from "react";
import { NavLink, Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import ShopEasy from "../../assets/ShopEasy.png";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { IoHomeOutline } from "react-icons/io5";
import { useCart } from "../../context/Cart";
import Badge from "react-bootstrap/Badge";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [Cart, setCart] = useCart();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    setCart("");
    toast.success("Logout successful");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-success-subtle">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              <img className="img-fluid logo" src={ShopEasy} alt="ShopEasy" />
            </Link>
            <div className="">
              <SearchInput />
            </div>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <NavLink
                  to="/"
                  className="nav-link d-flex flex-column align-items-center"
                >
                  <IoHomeOutline />
                  Home
                </NavLink>
              </li>
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className="nav-link d-flex flex-column align-items-center "
                    >
                      <CgProfile />
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown ">
                    <NavLink
                      className="nav-link dropdown-toggle d-flex  justify-content-center align-items-center"
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="d-flex justify-content-center align-items-center flex-column">
                        <CgProfile />

                        {auth?.user?.name}
                      </div>
                    </NavLink>

                    <ul className="dropdown-menu  ">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item ">
                <NavLink
                  to="/wishlist"
                  className="nav-link d-flex flex-column align-items-center"
                >
                  <IoMdHeartEmpty />
                  Wishlist
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/cart"
                  className="nav-link d-flex flex-column align-items-center"
                >
                  <FiShoppingCart />
                  <div>
                    Cart
                    <Badge pill bg="info">
                      {Cart.length}
                    </Badge>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
