const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const path = require("path")
const favicon = require('serve-favicon')
const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")


//================= PRIMARY ====================================
//================= ROUTING ====================================

// ======= MIDDLEWARE =======

// Load images from external upload folder
router.get('/show-item/:id', (req, res) => {
  var pathUrl = path.join(__dirname, "../../../uploads/", req.params.id)
  res.sendFile(pathUrl);
})

// Make favico fuck off
router.use(favicon('rag-site/public/res/favicon.ico'));

// Loading static files (CSS,JS)
router.use(express.static('rag-site/public'))

// DO ON EVERY CONNECTION MIDDLEWARE
router.use('/*', async (req, res, next) => {

  /* Basically this section needs to identify if this is a real user or a random bot
    making many connections & refusing cookies, but also not mix up two machines on the same IP

    https://stackoverflow.com/questions/54176924/nodejs-distinguishing-http-requests-multiple-devices-with-same-public-ip
    ^^^ This shows how to take basic fingerprint
    add user agent to user session and any new, cookie-less connection with the same agent will not
    generate new user session but be added to the old, along with a not about this being a bot.
  */
  var session = await UserServices.getUserByID(req.cookies.user_id)

  // If the user has no session saved
  if (!session) {
    session = UserServices.newUserSession()
    res.cookie('user_id', session._id, {
      maxAge: 31556926000,
      httpOnly: true
    })
    res.redirect(req.originalUrl);
  } else {
    var brands = await SiteServices.getBrandsList()
    res.locals = {
      cart_num: session.cart.length,
      brands: brands,
      animation: false,
    }
    next();
  }
})

// ====== FINAL ROUTING SECTION ===============================

router.get('/about', async (req, res) => { // SPECIFIC ITEM
  res.render('pages/about.ejs')
})

router.get('/item/:id', async (req, res) => { // SPECIFIC ITEM
  var item = await SiteServices.getInventoryByID(req.params.id)
  res.render('pages/item_view.ejs', {
    item: item,
  })
})

router.get('/category/:category', async (req, res) => { // CATEGORY
  var inventory = await SiteServices.getInventoryByCategory(req.params.category)
  res.render('pages/index.ejs', {
    show_items: inventory
  })
})

router.get('/brand/:brand', async (req, res) => { // BRAND
  var inventory = await SiteServices.getInventoryByBrand(req.params.brand)
  res.render('pages/index.ejs', {
    show_items: inventory
  })
})

router.get('/sale', async (req, res) => { // SALE

})

router.get('/cart', async (req, res) => { // CART
  const cart_pack = await UserServices.getUserCart(req.cookies.user_id)
  res.render('pages/cart.ejs', {
    cart: cart_pack.cart,
    total: cart_pack.total,
  })
})

router.get('/$', async (req, res) => { // INDEX PAGE
  var inventory = await SiteServices.getFullInventory()
  res.render('pages/index.ejs', {
    show_items: inventory,
    animation: true,
  })
})

router.get('/*', (req, res) => { // ALL OTHER ROUTES
  res.render('pages/util/404.ejs')
})

module.exports = router
