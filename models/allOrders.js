import mongoose from "mongoose";

const allOrder = new mongoose.Schema(
  {
    userEmail: { type: String, require: true },
    customerId: { type: String },
    paymentIntentId: { type: String },
    product: [
      {
        quantity: { type: Number },
        name: { type: String },
        price: { type: Number },
        img: { type: String },
      },
    ],
    subtotal: { type: Number, require: true },
    total: { type: Number, require: true },
    shipping: { type: Object, require: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, require: true },
  },
  { timestamps: true }
);
const AllOrder = mongoose.model("AllOrder", allOrder);

export default AllOrder;
