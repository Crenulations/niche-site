const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")

// Import Middleware
const {validateUserSession: validateUserSession} = require("../middlewares/SessionMiddleware")

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

module.exports = router
