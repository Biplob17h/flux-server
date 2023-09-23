import express from "express";
import formidable from "express-formidable";
import { createNewUser, updateUserphotoController } from "../controllers/userController.js";

const router = express.Router();

// User || POST
router.post("/", createNewUser);

//create product 
router.put(
    "/update-userdata",
    formidable(),
    updateUserphotoController
  );



export default router;
