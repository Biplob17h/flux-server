import { stripePayment, webHook } from "../Stripe/Stripe.js";
import express from "express";



const router = express.Router();

router.post("/create-checkout-session", stripePayment);

router.post('/webhook', express.raw({type: 'application/json'}),webHook)

export default router
