import express from "express";

import formidable from "express-formidable";
import {
    createStoryController,
    getStoryController,
    singleStoryController,
    StoryPhotoController,
    deleteStoryController,
    updateStoryController
} from "../controllers/ourstoriesController.js";
const router = express.Router();

//routes
//create story
router.post("/create-ourstory", formidable(), createStoryController);

//update story
router.put("/update-ourstory/:pid", formidable(), updateStoryController);

//get story
router.get("/get-ourstory", getStoryController);

// //single story
router.get("/single-ourstory/:slug", singleStoryController);

//get photo
router.get("/ourstory-photo/:pid", StoryPhotoController);

//delete story
router.delete("/delete-ourstory/:pid", deleteStoryController);

export default router;
