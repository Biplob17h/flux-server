import mongoose from "mongoose";

const fluxFreedom = new mongoose.Schema(
  {
    userEmail: { type: String, require: true },
    customerId: { type: String},
    paymentIntentId: { type: String},
    fluxFreedom: [
      {
        quantity: { type: Number },
        name:{type:String},
        price:{type:Number},
        img:{type:String}
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
const FluxFreedomOrder = mongoose.model("FluxFreedomOrder", fluxFreedom)

export default FluxFreedomOrder;
