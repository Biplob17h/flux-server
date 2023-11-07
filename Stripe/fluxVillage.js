import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);
import AllOrder from "../models/allOrders.js";

export const village = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userEmail: req.body.Email,
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
