import express from "express";
import { Store, webHookStore } from "../Stripe/store.js";

const router = express.Router();
router.post("/create-checkout-session", Store);
router.post('/webhook', express.raw({type: 'application/json'}),webHookStore)


export default router