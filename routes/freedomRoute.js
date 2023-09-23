import { freedom, webHookFreedom } from "../Stripe/fluxFreedom.js";
import express from "express";



const router = express.Router();

router.post("/create-checkout-session", freedom);

router.post('/webhook', express.raw({type: 'application/json'}),webHookFreedom)

export default router
