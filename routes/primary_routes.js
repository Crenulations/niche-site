const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const path = require("path")
const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")


//================= PRIMARY ====================================
//================= ROUTING ====================================
//     This section is for GET request of the REST API

// ======= MIDDLEWARE ==================================

router.get('/show-item/:id', (req, res) => { // Send Image
  res.sendFile(path.join(__dirname, "../../uploads/", req.params.id));
})

// Loading static files (CSS,JS)
router.use(express.static('rag-site/public'))

router.use('/*', (req, res, next) => {
  Inventory_Item.distinct("brand", function(err, brands) {
    UserSession.findById(req.cookies.user_id, async (err, session) => {
      // If the user has no session
      if(!session){
        session = new UserSession()
        session.ip = req.connection.remoteAddress;
        session.save()
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        expires -= new Date()
        res.cookie('user_id',session._id, { maxAge: 31556926000 , httpOnly: true })
        res.redirect(req.originalUrl);
      }

      res.locals = {
        cart_num: session.cart.length,
        brands: brands,
      }

      next();
    })
  })
})
// ====== FINAL ROUTING SECTION ===============================

router.get('/about', async (req, res) => { // SPECIFIC ITEM
  res.render('pages/about.ejs')
})

router.get('/item/:id', async (req, res) => { // SPECIFIC ITEM
  Inventory_Item.findById(req.params.id, function(err, item) {
    res.render('pages/item_view.ejs', {
      item: item,
    })
  })
})

router.get('/category/:category', async (req, res) => { // CATEGORY
  Inventory_Item.find({
    category: req.params.category
  }, function(err, items) {
    res.render('pages/index.ejs', {
      show_items: items
    })
  })
})

router.get('/brand/:brand', async (req, res) => { // BRAND
  Inventory_Item.find({
    brand: req.params.brand
  }, function(err, items) {
    res.render('pages/index.ejs', {
      show_items: items
    })
  })
})

router.get('/sale', async (req, res) => { // SALE
  Inventory_Item.distinct("brand", function(err, item) {
    res.send(item)
  })
})

router.get('/cart', (req, res) => { // CART

  UserSession.findById(req.cookies.user_id, async (err, session) => {

    console.log("===== LOADING CART ======")
    console.log("# ITEMS:  "+session.cart.length)

    var cart = [[],[]];
    var total = 0;

    async function loadCart(){
      for(i=0; i<session.cart.length; i++){

        var entry = session.cart[i]
        let item = await Inventory_Item.findById(entry.item)

        //This checks if item has been deleted but it should also check if is sold out.
        if(item == null){
          console.log("   - Depricated Item "+i)
          session.cart.splice(i,1)
          session.save();
        }else{
          console.log("   - Loading Item "+i+" ~ "+item.price)
          if(item.discount_price != null){
            total += item.discount_price
          }else{ total += item.price }
          cart[0].push(item)
          cart[1].push(entry.item_size)
        }
      }
      console.log(cart[1])
      res.render('pages/cart.ejs',{
        cart: cart,
        total: total,
      })
    }

    loadCart();

  })
})

router.get('/$', async (req, res) => { // INDEX PAGE
  Inventory_Item.find({}, function(err, items) {
    res.render('pages/index.ejs', {
      show_items: items
    })
  })
})

// Make favico fuck off
router.get('/favico*', (req, res) => {})

router.get('/*', (req, res) => { // ALL OTHER ROUTES
  console.log('pages' + req.url)
  res.render('pages' + req.url)
})

module.exports = router
