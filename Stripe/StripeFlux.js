import dotenv from "dotenv";
dotenv.config()
import Stripe from "stripe";
import FluxOrder from "../models/FluxOrderModel.js";
const stripe = Stripe("sk_test_51NmhimDBfEUXxFmsDpeyp80ETnf2sfcwxJ7hlusnFlSv9M1OT63O70jrzvw3A01xRoIidGRIs5PjCmdSKUZIepYn00cIBAjSlX");


 export const fluxPayment = async (req, res) => {
    try {
      const customer = await stripe.customers.create({
        metadata:{
          userId:req.body.userId,
          cart: JSON.stringify(req.body.fluxVillage)
        }
      })
      const line_items = req.body.fluxVillage.map((items) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: items.name,
              images: [items.img]
            },
            unit_amount: items.price * 100,
          },
          quantity: 1,
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


  const createFluxOrder = async(customer, data)=>{
    const Items = JSON.parse(customer.metadata.cart)
  
    const newOrder = new FluxOrder({
      userId:customer.metadata.userId,
      customerId:data.customer,
      paymentIntentId:data.payment_intent,
      fluxVillage: Items,
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


  // const endpointSecret = "whsec_O5DbKsvRDPMLkShRn6kObv3Gcdmo4fHO";
  let endpointSecret;
  
  
  export const webHookFlux = (req, res) => {
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
        createFluxOrder(customer, data)
    }).catch(err=>console.log(err.message))
  }
  
    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
