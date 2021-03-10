const express = require("express")
const router = express.Router()
const bodyParser = require('body-parser')
const StripeServices = require("../services/StripeServices")

// Import Middleware
const {validateUserSession: validateUserSession} = require("../middlewares/SessionMiddleware")

router.use(validateUserSession)


router.post('/create-checkout-session', async (req, res) => {
  const session = await StripeServices.generateStripeCheckout(req.session._id)
  res.json({ id: session.id })
})

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const payload = request.body;

  console.log("Got payload: " + payload);

  response.status(200);
});

module.exports = router
