import express from "express";
import formidable from "express-formidable";
import { updateAdminPhotoController } from "../controllers/adminPhotoController.js";




const router = express.Router();


//update product 
router.put(
    "/update-adminphoto/:pid",
    formidable(),
    updateAdminPhotoController
  );


  export default router;