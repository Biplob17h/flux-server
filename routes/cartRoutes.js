import express from "express";
import {
  addToCart,
  deleteCart,
  getAllCart,
  updateCartQuentity,
} from "../controllers/cartController.js";
const routes = express.Router();

// add to cart
routes.put("/", addToCart);

// get all crat data
routes.get("/", getAllCart);

// update quentity
routes.put("/quentity/:id", updateCartQuentity);

// delete cart item
routes.delete("/:id", deleteCart);

export default routes;
