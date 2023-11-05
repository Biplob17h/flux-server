import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);
import AllOrder from "../models/allOrders.js";

export const village = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userEmail: req.body.villageEmail,
        cart: JSON.stringify(req.body.fluxVillage),
      },
    });
    const line_items = req.body.fluxVillage.map((items) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: items.name,
            images: [items.img],
          },
          unit_amount: items.price * 100,
        },
        quantity: 1,
      };
    });
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "BD"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      customer: customer.id,
      line_items,
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      success_url: `${process.env.SUCCESS_URL}`,
      cancel_url: `${process.env.VILLAGE_CANCEL_URL}`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
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
let endpointSecret = "whsec_4e481bf59841e6418b74a138c6dfaf838ad2c9cb96c19d35364be0f1fea0d56c";

export const webHookFlux = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createFluxOrder(customer, data);
      })
      .catch((err) => console.log(err.message));
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send().end();
};


export const getAllOrder = async (req, res) => {
  try {
    const email = req.query.Email;
    const query = {
      userEmail: email,
    };
    const cartData = await AllOrder.find(query);
    res.send({
      res: "success",
      cartData,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      message: "Error in get all cart",
    });
  }
};
