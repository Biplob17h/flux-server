import express from "express";
import { village, webHookFlux } from "../Stripe/fluxVillage.js";

const router = express.Router();
router.post("/create-checkout-session", village);
router.post('/webhook', express.raw({type: 'application/json'}),webHookFlux)



export default router
