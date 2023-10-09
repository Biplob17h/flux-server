import express from "express";
import {
  village,
  getVillageOrders,
  webHookFlux,
} from "../Stripe/fluxVillage.js";

const router = express.Router();
router.get("/village-orders", getVillageOrders);
router.post("/create-checkout-session", village);
router.post("/webhook", express.raw({ type: "application/json" }), webHookFlux);

export default router;
