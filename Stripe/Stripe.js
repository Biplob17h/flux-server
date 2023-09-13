import dotenv from "dotenv";
dotenv.config()
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
    [1, { priceInCents: 8500000, name: "Rear-Wheel Drive(Flux Village)" }],
    [2, { priceInCents: 11000000, name: "Dual Motor All-Wheel Drive(Flux Village Power)" }],
    [19592, { priceInCents: 200000, name: "Gray Multi-Coatt" }],
    [18077, { priceInCents: 100000, name: "Deep Blue Metallict" }],
    [10062, { priceInCents: 140000, name: "Pearl White Multi-Coatt" }],
    [19084, { priceInCents: 300000, name: "Midnight Silver Metallict" }],
    [17743, { priceInCents: 400000, name: "Solid Blackt" }],
    [123456, { priceInCents: 100000, name: "Black White Int" }],
    [1864, { priceInCents: 100000, name: "Gray Multi-Coatt(19’’ Sport Wheels)" }],
    [1188, { priceInCents: 0, name: "Gray Multi-Coatt(18’’ Aero Wheels)" }],
    [1692, { priceInCents: 200000, name: "Deep Blue Metallict(18’’ Sport Wheel)" }],
    [1206, { priceInCents: 300000, name: "Deep Blue Metallict(18’’ Black Wheel)" }],
    [1028, { priceInCents: 130000, name: "Pearl White Multi-Coatt(19’’ Sport Wheels)" }],
    [1576, { priceInCents: 130000, name: "Pearl White Multi-Coatt(18’’ Aero Wheels)" }],
    [1371, { priceInCents: 150000, name: "Midnight Silver Metallict(Sport Wheel)" }],
    [1372, { priceInCents: 170000, name: "Midnight Silver Metallict(19’’ Aero Wheels)" }],
    [1003, { priceInCents: 200000, name: "Solid Blackt(19’’ Sport Wheels)" }],
    [1472, { priceInCents: 200000, name: "Solid Blackt(18’’ Aero Wheels)" }],
    [1122, { priceInCents: 500000, name: "Wall Charger" }],
    [1212, { priceInCents: 500000, name: "Remote Chrager" }],
    [12345, { priceInCents: 0, name: "Wall Charger(Not Selected)" }],
    [12344, { priceInCents: 0, name: "Remote Chrager(Not Selected)" }],
  ]);

const stripePayment = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map((item) => {
          const storeItem = storeItems.get(item.id);
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${process.env.SERVER_URL}/success.html`,
        cancel_url: `${process.env.SERVER_URL}/success.html`,
      });
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  export default stripePayment;