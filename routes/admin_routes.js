const express = require("express")
const multer = require("multer")
const router = express.Router()
const { v1: uuidv1 } = require('uuid');
const Inventory_Item = require("../models/Inventory_Item")

router.use(express.json()); // to support JSON-encoded bodies
router.use(express.urlencoded()); // to support URL-encoded bodies

//================= ADMIN ====================================
//================= ROUTING ====================================
//     This section is for ADMIN GET request of the REST API

// ======= MIDDLEWARE ==================================

// Loading static files (CSS,JS)
router.use(express.static('rag-site/public'))

// ====== FINAL ROUTING SECTION ===============================

router.get('/new_item', async (req, res) => { // INDEX PAGE
  const item = new Inventory_Item({
    brand: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    minor_descriptions: [],
    sold_out: true,
    images: [],
  })
  await item.save();
  res.redirect("/admin/item/"+item._id)
})

router.get('/item/:id', async (req, res) => { // INDEX PAGE
  Inventory_Item.findById(req.params.id, function(err, item) {
    res.render('pages/admin/item.ejs',{
      item: item,
    })
  })
})

router.get('/*', async (req, res) => { // INDEX PAGE
  Inventory_Item.find({}, function(err, items) {
    res.render('pages/admin/admin.ejs', {
      items: items,
    })
  })

})


// ===== POST =====

var storage = multer.diskStorage({
        destination: "uploads",
        filename: function ( req, file, cb ) {
          let uid = uuidv1()+".jpg";
          req.img_url = uid;
          cb( null, uid);
        }
    }
);
var upload = multer( { storage: storage } );

router.post('/new_image/:id', upload.single('image'), (req, res) => {
  console.log("IMAGE LOGGED")
  Inventory_Item.findById(req.params.id, function(err, item) {
    item.images.push(""+req.img_url)
    item.save();
  })
  res.redirect('back')
})

router.post('/update_item/:id', (req, res) => {

  if(req.body.delete == "clicked"){

    // VERY MUCH NEEDS A SYSTEM TO GO THROUGH AND WIPE THIS ID FROM EVERY
    // USER SESSION'S CART, THIS CAUSES A CRASH ON USER SIDE
    Inventory_Item.findByIdAndDelete(req.params.id, function (err) {
      if(err) console.log(err);
      console.log("Successful deletion");
    });

  }else{ Inventory_Item.findById(req.params.id, function(err, item) {
    item.brand = req.body.brand
    item.description = req.body.description
    item.price = req.body.price
    item.discount_price = req.body.discount_price
    item.category = req.body.category
    // Load the minor Descriptions
    var minor_descs = []
    for(i=0; i>-1; i++){
      var desc = req.body["minor_description_"+i]
      console.log(desc)
      if (desc == undefined || desc == null)
        break;
      else if (desc != "")
        minor_descs.push(desc)
    }
    item.minor_descriptions = minor_descs,

    item.save()
  })}
  res.redirect('/admin')
})

module.exports = router
