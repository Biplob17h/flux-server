import express from "express";
import {
  village,
  getAllOrder,
} from "../Stripe/fluxVillage.js";


const router = express.Router();
router.post("/create-checkout-session", village);
router.get("/allorder", getAllOrder);


export default router;
