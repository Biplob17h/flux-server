import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  product: {
    type: Object,
  },
});

const Cart = mongoose.model("cart");
export default Cart;
