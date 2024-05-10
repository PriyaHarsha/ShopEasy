import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Pagenotfound from "./pages/Pagenotfound";
import Login from "./pages/Authentication/Login.js";
import SignUp from "./pages/Authentication/SignUp.js";
import Dashboard from "./pages/user/Dashboard.js";
import PrivateRoute from "./components/Routes/PrivateRoute.js";
import ForgetPW from "./pages/Authentication/ForgetPW.js";
import AdminRoute from "./components/Routes/AdminRout.js";
import AdminDashboard from "./pages/Admin/AdminDashboard.js";
import CreateCategory from "./pages/Admin/CreateCategory.js";
import { CreateProduct } from "./pages/Admin/CreateProduct.js";
import Orders from "./pages/user/Orders.js";
import AllOrders from "./pages/Admin/AllOrders.js";
import AllProducts from "./pages/Admin/AllProducts.js";
import EditProduct from "./pages/Admin/EditProduct.js";
import ManageAddress from "./pages/user/ManageAddress.js";
import ProductDetails from "./pages/ProductDetails.js";
import Search from "./pages/Search.js";
import Cart from "./pages/Cart.js";
import WishList from "./pages/WishList.js";
import PaymentSuccess from "./pages/PaymentSuccess.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/manage-address" element={<ManageAddress />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-catagory" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/all-products" element={<AllProducts />} />
          <Route path="admin/all-products/:slug" element={<EditProduct />} />
          <Route path="admin/orders" element={<AllOrders />} />
        </Route>
        <Route path="/forgetPW" element={<ForgetPW />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishList" element={<WishList />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />

        <Route path="/product-detail/:slug" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
