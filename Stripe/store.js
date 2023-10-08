import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../models/orderModel.js";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

export const Store = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userEmail: req.body.userEmail,
        cart: JSON.stringify(req.body.products),
      },
    });
    const line_items = req.body.products.map((items) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: items.product.name,
            images: [items.product.img],
            metadata: {
              id: items._id,
            },
          },
          unit_amount: items.product.price * 100,
        },
        quantity: items.quentity,
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
      cancel_url: `${process.env.CANCEL_URL}`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// product order db
const createOrder = async (customer, data) => {
    const Items = JSON.parse(customer.metadata.cart);
  
    const newOrder = new FluxOrders({
      userEmail: customer.metadata.userEmail,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: Items,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
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
let endpointSecret;

export const webHookStore = (req, res) => {
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
        createOrder(customer, data);
      })
      .catch((err) => console.log(err.message));
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send().end();
};

// export const getFreedomProductOrders = async (req, res) => {
//   try {
//     const email = req.query.userEmail;
//     const query = {
//       userEmail: email,
//     };
//     const cartData = await FluxOrders.find(query);
//     res.send({
//       res: "success",
//       cartData,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       error,
//       message: "Error in get all cart",
//     });
//   }
// };