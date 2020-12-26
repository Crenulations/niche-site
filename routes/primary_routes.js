const express = require("express")
const router = express.Router()
const path = require("path")
const Inventory_Item = require("../models/Inventory_Item")

//================= PRIMARY ====================================
//================= ROUTING ====================================
//     This section is for GET request of the REST API

// ======= MIDDLEWARE ==================================

router.get('/show-item/:id', (req, res) => {
  res.sendFile(path.join(__dirname,"../../uploads/",req.params.id));
})

// Loading static files (CSS,JS)
router.use(express.static('../public'))

// ====== FINAL ROUTING SECTION ===============================

router.get('/item/:id', async (req, res) => { // INDEX PAGE
  Inventory_Item.findById(req.params.id, function(err, item) {
    res.render('pages/item_view.ejs', {
      item: item,
    })
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
