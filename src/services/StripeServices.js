const UserServices = require("./UserServices")


const stripe = require('stripe')('sk_test_51I716xDScnxQKL28PKQkaf9uIYAWhdry4CoSrJpMbhdVZhT18iyyiDDDOOeJtKvO3BAAGagjhrCbyW262u05L1fR00tEQPnxua');

const DOMAIN = "http://niche-thrift.com"

exports.generateStripeCheckout = async (id) => {
  const userSession = await UserServices.findUserById(id)
  const cart_pack = await UserServices.getUserCart(id)
  const total = cart_pack.total*100
  const stripeSession = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
   line_items: [
     {
       price_data: {
         currency: 'usd',
         product_data: {
           name: 'Total',
         },
         unit_amount: total,
       },
       quantity: 1,
     },
   ],
   mode: 'payment',
   success_url: `${DOMAIN}/checkout_success`,
   cancel_url: `${DOMAIN}/cart`,
 })
 return stripeSession
}
