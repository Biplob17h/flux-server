import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const product = req.body;
    const addCart = new Cart(product);
    const result = await addCart.save();
    res.json({
      res: "success",
      result,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      message: "Error in add to cart",
    });
  }
};
export const getAllCart = async (req, res) => {
  try {
    const email = req.query.email;
    const query = {
      email: email,
    };
    const cartData = await Cart.find(query);
    res.json({
      res: "success",
      cartData,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      message: "Error in get all cart",
    });
  }
};
export const updateCartQuentity = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: id };
    const cartData = await Cart.findOneAndUpdate(filter, req.body);
    res.json({
      res: "success",
      cartData,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      message: "Error in get cart quentity",
    });
  }
};
export const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const cartData = await Cart.findOneAndDelete({ _id: id });
    res.json({
      res: "success",
      cartData,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      message: "Error in get cart quentity",
    });
  }
};
