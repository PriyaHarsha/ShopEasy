import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.ObjectId, ref: "products", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    user: {
      type: mongoose.ObjectId,
      ref: "user",
      required: true,
    },
    totalPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model("carts", cartSchema);
