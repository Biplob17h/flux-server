import express from "express";
import {
  deleteASubscriber,
  postASubscriber,
} from "../controllers/subscriberController.js";
const app = express();
app.use(express.json());
const router = express.Router();

// post subscriber
router.post("/", postASubscriber);

// delete subscriber
router.delete("/:id", deleteASubscriber);

export default router;
