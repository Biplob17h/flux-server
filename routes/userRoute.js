import express from "express";
import { createNewUser } from "../controllers/userController.js";
const app = express();
app.use(express.json());

const router = express.Router();

// User || POST
router.post("/", createNewUser);

export default router;
