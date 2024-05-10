import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cart: [
      {
        product: { type: mongoose.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
      },
    ],
    payment: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
