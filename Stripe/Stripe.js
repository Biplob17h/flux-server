import dotenv from "dotenv";
dotenv.config()
import Stripe from "stripe";
import Order from "../models/orderModel.js";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

 export const stripePayment = async (req, res) => {
    try {
      const customer = await stripe.customers.create({
        metadata:{
          userId:req.body.userId,
          cart: JSON.stringify(req.body.products)
        }
      })
      const line_items = req.body.products.map((items) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: items.product.name,
              images: [items.product.img],
              metadata:{
                id: items._id
              }
            },
            unit_amount: items.product.price * 100,
          },
          quantity: items.quentity,
        };
      });
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'BD'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 0,
                currency: 'usd',
              },
              display_name: 'Free shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 5,
                },
                maximum: {
                  unit: 'business_day',
                  value: 7,
                },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1500,
                currency: 'usd',
              },
              display_name: 'Next day air',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 1,
                },
              },
            },
          },
        ],
        customer:customer.id,
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
  }


const createOrder = async(customer, data)=>{
  const Items = JSON.parse(customer.metadata.cart)

  const newOrder = new Order({
    userId:customer.metadata.userId,
    customerId:data.customer,
    paymentIntentId:data.payment_intent,
    products: Items,
    subtotal:data.amount_subtotal,
    total:data.amount_total,
    shipping:data.customer_details,
    payment_status:data.payment_status,
  })
  try {
    const savedOrder = await newOrder.save()
    console.log("procced order",savedOrder)
  } catch (error) {
    console.log(error.message)
  }
}


  let endpointSecret;
  // const endpointSecret = "whsec_023090e278970076a253592623e920084ce79890b46d303a769a6211b7844073";
  
  
  export const webHook = (req, res) => {
    const sig = req.headers['stripe-signature'];
  
  
    let data;
    let eventType;
  
    if(endpointSecret){
    let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("webhook verified")
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object
      eventType = event.type
    }else{
      data = req.body.data.object;
      eventType = req.body.type
    }
  
  if(eventType === "checkout.session.completed"){
    stripe.customers.retrieve(data.customer).then((customer)=>{
      createOrder(customer, data)
    }).catch(err=>console.log(err.message))
  }
  
    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
