import express from "express";
import { Store, ProductOrders, webHookStore } from "../Stripe/store.js";

const router = express.Router();
router.get("/product-orders", ProductOrders);
router.post("/create-checkout-session", Store);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webHookStore
);

export default router;
