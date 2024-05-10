import axios from "axios";

//get all cart products
const getAllCart = async (auth, setCart, setCartId) => {
  const userId = auth?.user?._id;

  try {
    if (auth?.user) {
      const { data } = await axios.get(`/api/v1/cart/get-all-cart/${userId}`);
      data?.cart?._id ? setCartId(data.cart._id) : setCartId("");
      data?.cart?.cartItems ? setCart(data.cart.cartItems) : setCart([]);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllCart;
