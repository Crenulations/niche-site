const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")
const StripeServices = require("../services/StripeServices")

// Import Middleware
const {validateUserSession: validateUserSession} = require("../middlewares/SessionMiddleware")

router.use(cookieParser());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.use(validateUserSession)

router.post('/add_cart', async (req, res) => {
  await UserServices.addItemToCart(req.session._id, req.body.item_id, req.body.item_size)
  res.redirect('/cart');
})

router.post('/remove_cart/:cart_num', async (req, res) => {
  await UserServices.removeItemFromCart(req.cookies.user_id, req.params.cart_num)
  res.redirect('back')
})

router.post('/add_email', async (req, res) => {
  UserServices.addEmail(req.session._id, req.body.email)
  res.redirect('back')
})

router.post('/create-checkout-session', async (req, res) => {
  const order = await SiteServices.createOrder(req.session._id)
  const session = await StripeServices.generateStripeCheckout(order)
  res.json({ id: session.id })
})


module.exports = router
