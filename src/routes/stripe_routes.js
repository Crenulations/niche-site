const express = require("express")
const router = express.Router()
const bodyParser = require('body-parser')
const StripeServices = require("../services/StripeServices")
const SiteServices = require("../services/StripeServices")


router.post('/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  console.log("STRIPE WEBHOOK ACTIVATED")

  let event = StripeServices.verifyOrder(req,res)
  res.status(200).send()

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Fulfill the purchase...
    await StripeServices.fulfillOrder(event)
  }
});

module.exports = router
