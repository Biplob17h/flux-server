import express from "express";
import {  village, webHookFlux } from "../Stripe/fluxVillage.js";
// getVillageOrders,
const router = express.Router();
// router.get('/village-orders',getVillageOrders)
router.post("/create-checkout-session", village);
router.post('/webhook', express.raw({type: 'application/json'}),webHookFlux)



export default router
