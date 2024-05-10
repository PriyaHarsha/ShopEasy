import axios from "axios";

//get all wishlist products
const getAllWishlist = async (auth, setWishlist) => {
  const userId = await auth?.user?._id;

  try {
    if (auth?.user) {
      const { data } = await axios.get(
        `/api/v1/wishlist/get-all-wishlist/${userId}`
      );
      setWishlist(data.wishlist);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllWishlist;
