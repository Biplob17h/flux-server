import {
  freedom,
  getFreedomOrders,
  webHookFreedom,
} from "../Stripe/fluxFreedom.js";
import express from "express";

const router = express.Router();
router.get("/freedom-orders", getFreedomOrders);
router.post("/create-checkout-session", freedom);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webHookFreedom
);

export default router;
