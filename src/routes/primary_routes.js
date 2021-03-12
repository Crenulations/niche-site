const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const path = require("path")
const favicon = require('serve-favicon')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")
const StripeServices = require("../services/StripeServices")


// ======= MIDDLEWARE =======

// Import Middleware
const {validateUserSession: validateUserSession} = require("../middlewares/SessionMiddleware")

router.use(cookieParser());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// Load images from external upload folder
router.get('/show-item/:id', (req, res) => {
  var pathUrl = path.join(__dirname, "../../../uploads/", req.params.id)
  res.sendFile(pathUrl);
})

// Make favico fuck off
router.use(favicon('niche-site/public/res/favicon.ico'));

// Loading static files (CSS,JS)
router.use(express.static('niche-site/public'))

router.use(validateUserSession)




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
  var inventory = await SiteServices.getInventoryBySale()
  res.render('pages/index.ejs', {
    show_items: inventory
  })
})

router.get('/cart', async (req, res) => { // CART
  const cart_pack = await UserServices.getUserCart(req.session._id)
  res.render('pages/cart.ejs', {
    cart: cart_pack.cart,
    total: cart_pack.total,
  })
})

router.get('/checkout-success', async (req, res) => {
  res.render('pages/util/checkout-success.ejs')
})

router.get('/$', async (req, res) => { // INDEX PAGE
  var inventory = await SiteServices.getAvailableInventory()
  res.render('pages/index.ejs', {
    show_items: inventory,
    animation: true,
  })
})

router.get('/test', async (req, res) => { // INDEX PAGE
  res.render('pages/test.ejs')
})

router.get('/*', (req, res) => { // ALL OTHER ROUTES
  res.render('pages/util/404.ejs')
})

module.exports = router
