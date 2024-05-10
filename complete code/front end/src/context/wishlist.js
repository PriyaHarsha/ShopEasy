import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth.js";
import getAllWishlist from "../components/Layout/getAllWishlist.js";

const WishlistContext = createContext();
const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    getAllWishlist(auth, setWishlist);
  }, [auth]);

  return (
    <WishlistContext.Provider value={[wishlist, setWishlist]}>
      {children}
    </WishlistContext.Provider>
  );
};

// custom hook
const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
