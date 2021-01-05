const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const UserSession = require("../models/UserSession")


router.use(express.json()); // to support JSON-encoded bodies
router.use(express.urlencoded()); // to support URL-encoded bodies

// This router is used for POST requests
router.post('/add_cart', (req, res) => {
  UserSession.findById(req.cookies.user_id, function(err, session) {
      if (session==null) { // IF NEW USER ID GENERATE NEW ONE

        console.log("NEW USER SESSION GENERATED")
        const user = new UserSession({
          cart: [{
            item: req.body.item_id,
            item_size: req.body.item_size
          }]
        })
        user.save();

        // RENDER PAGE WHICH CREATES COOKIE STORING SESSION ID
        res.render('pages/util/new_user_session.ejs', {
          user_id: user._id,
        })

      } else {
        session.cart.push({item: req.body.item_id,item_size: req.body.item_size})
        session.save();
        res.redirect('/cart');
    }
  })

})

router.post('/remove_cart/:cart_num', (req, res) => {
  UserSession.findById(req.cookies.user_id, function(err, session) {
    console.log("REMOVING CART ITEM")
    console.log(session.cart)
    session.cart.splice(req.params.cart_num,1)
    session.save();
    res.redirect('/')
  })
})

router.post('/add_email', (req, res) => {
  UserSession.findById(req.cookies.user_id, function(err, session) {
    session.email = req.body.email;
    session.save();
    res.redirect('back')
  })
})




module.exports = router
