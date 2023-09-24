import express from "express";
import ExpressFormidable from "express-formidable";

import {
  createStoryController,
  deleteStoryController,
  getStoryController,
  singleStoryController,
  storyPhotoController,
  updateStoryController,
} from "../controllers/ourstoryController.js";

const router = express.Router();

//routes
//create product
router.post("/create-story", ExpressFormidable(), createStoryController);

//get products
router.get("/get-story", getStoryController);

//single product
router.get("/single-story/:slug", singleStoryController);

//get photo
router.get("/story-photo/:pid", storyPhotoController);

//delete product
router.delete("/delete-story/:pid", deleteStoryController);


//update product 
router.put(
    "/update-story/:pid",
    ExpressFormidable(),
    updateStoryController
  );

export default router;
