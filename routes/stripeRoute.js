import express from "express";
import { StripePayment, getAllOrder } from "../Stripe/stripePayment.js";


const router = express.Router();
router.post("/create-checkout-session", StripePayment);
router.get("/orders", getAllOrder);


export default router;