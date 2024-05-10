import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth.js";
import getAllCart from "../components/Layout/getAllCart.js";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState("");
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    getAllCart(auth, setCart, setCartId);
  }, [auth]);

  return (
    <CartContext.Provider value={[cart, setCart, cartId, setCartId]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
