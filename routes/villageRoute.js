import express from "express";
import {
  village,
  webHookFlux,
  getAllOrder,
} from "../Stripe/fluxVillage.js";

const router = express.Router();
router.get("/allorder", getAllOrder);
router.post("/create-checkout-session", village);
router.post("/webhook", express.raw({ type: "application/json" }), webHookFlux);

export default router;
