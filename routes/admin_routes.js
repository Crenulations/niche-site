const express = require("express")
const multer = require("multer")
const router = express.Router()
const Inventory_Item = require("../models/Inventory_Item")

router.use(express.json()); // to support JSON-encoded bodies
router.use(express.urlencoded()); // to support URL-encoded bodies

//================= ADMIN ====================================
//================= ROUTING ====================================
//     This section is for ADMIN GET request of the REST API

// ======= MIDDLEWARE ==================================

// Loading static files (CSS,JS)
router.use(express.static('../public'))

// ====== FINAL ROUTING SECTION ===============================

router.get('/*', async (req, res) => { // INDEX PAGE
  res.render('pages/admin/admin.ejs')
})

// ===== POST =====
router.use('/new_item', function (req, res, next) {
  var id = req.body.brand+req.body.description
  req.image_id = id;
  next()
})
var storage = multer.diskStorage({
        destination: "../../uploads",
        filename: function ( req, file, cb ) {
            cb( null, req.body.brand.replace(/ /g,"_")+"__"+req.body.description.replace(/ /g,"_")+".jpg");
        }
    }
);
var upload = multer( { storage: storage } );

router.post('/new_item',upload.single("image"), (req, res) => {
  console.log(req.body)
  const item = new Inventory_Item({
    brand: req.body.brand,
    description: req.body.description,
    price: req.body.price,
    discount_price: req.body.discount_price,
    sold_out: true,
    image: req.body.brand.replace(/ /g,"_")+"__"+req.body.description.replace(/ /g,"_")+".jpg",
  })
  item.save()
  res.redirect('back');
})

module.exports = router
