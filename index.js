import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";
import adminphotoRouter from "./routes/adminPhotoRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import ourstoryRoutes from "./routes/ourstoryRoute.js";
import UserRouter from "./routes/userRoute.js";
dotenv.config();

// Stripe related
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);
import bodyParser from "body-parser";
import AllOrder from "./models/allOrders.js";
import StripePayment from "./routes/stripeRoute.js";
// Stripe related



//pass : mk0dsWGiINJqz77m


// Stripe Webhook
const app = express();
app.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),

  
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_PRIVATE_SIGNING_KEY

    let event;

    // webhook verification
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
// webhook verification


    // retrieving data
     if (event.type === "checkout.session.completed") {
      stripe.customers
        .retrieve(event.data.object.customer)
        .then((customer) => {
          createFluxOrder(customer, event.data.object);
        })
        .catch((err) => console.log(err.message));
    }
// retrieving data


    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);
// Stripe Webhook


// Orders Function
const createFluxOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const newOrder = new AllOrder({
    userEmail: customer.metadata.userEmail,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    product: Items,
    subtotal: data.amount_subtotal / 100,
    total: data.amount_total / 100,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });
  try {
    const savedOrder = await newOrder.save();
    console.log("procced order", savedOrder);
  } catch (error) {
    console.log(error.message);
  }
};
// Orders Function



app.use(express.json());

//config env
dotenv.config();
const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/ourstory", ourstoryRoutes);


// Stripe Payment 
app.use("/stripe", StripePayment)
// Stripe Payment 



app.use("/api/v1/adminphoto", adminphotoRouter);

//rest api
app.get("/", (req, res) => {
  res.send(`Flux Car Server Is Running`);
});

//server run
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgMagenta);
  connectDB();
});
