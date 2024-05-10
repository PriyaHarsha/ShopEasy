import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    wishlistItems: [
      {
        product: { type: mongoose.ObjectId, ref: "products", required: true },
      },
    ],
    user: {
      type: mongoose.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("wishlists", wishlistSchema);
