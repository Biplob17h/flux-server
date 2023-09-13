import Stripe  from "../Stripe/Stripe.js";
import express from "express";

const router = express.Router();

router.post("/create-checkout-session", Stripe);

export default router
