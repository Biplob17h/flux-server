import express from "express";
import {
  createProductController,
  getProductController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create product 
router.post(
  "/create-product",
  formidable(),
  createProductController
);

//update product 
router.put(
  "/update-product/:pid",
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

// //single product
router.get("/single-product/:slug", singleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);


export default router;
