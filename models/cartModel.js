import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  quentity: {
    type: Number,
    required: true,
  },
  product: {
    type: Object,
  },
});

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
