const UserServices = require("./UserServices")
const SiteServices = require("./SiteServices")

const Order = require("../models/Order")

const stripe = require('stripe')('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');
const endpointSecret = "whsec_vWYCdYX3ceERF8j1sq83i3YctKZPpvw8"
const DOMAIN = "https://nychecollections.com"

exports.generateStripeCheckout = async (order) => {
  console.log("Generating Stripe Checkout  $: "+order.total)
  const stripeSession = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
   metadata: {'order_id': ''+order._id},
   line_items: [
     {
       price_data: {
         currency: 'usd',
         product_data: {
           name: 'Total',
         },
         unit_amount: order.total,
       },
       quantity: 1,
     },
   ],
   mode: 'payment',
   success_url: `${DOMAIN}/checkout-success`,
   cancel_url: `${DOMAIN}/cart`,
   shipping_address_collection: {
     allowed_countries: ['US', 'CA'],
   }
 })
 return stripeSession
}

exports.verifyOrder = (req,res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    return event;
  } catch (err) {
    console.log("ERROR "+err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

}

// --------- ORDERS
exports.fulfillOrder = async (session) => {
  console.log("PAYMENT RECEIVED, FULFILLING ORDER")

  let metadata = session.data.object.metadata;
  console.log("METADATA  ", metadata);

  order = await SiteServices.getOrderByID(metadata.order_id)
  order.payed = true
  order.save()

  order.items.forEach((item, i) => {
    SiteServices.selloutInventory(item)
  });

  user = await UserServices.wipeUserCart(order.user_id)

}
