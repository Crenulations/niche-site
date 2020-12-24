const express = require("express")
const router = express.Router()

//================= PRIMARY ====================================
//================= ROUTING ====================================
//     This section is for GET request of the REST API

// ======= MIDDLEWARE ==================================

// Loading static files (CSS,JS)
router.use(express.static('public'))

// ====== FINAL ROUTING SECTION ===============================

router.get('/$', async (req, res) => { // INDEX PAGE
  res.render('pages/index.ejs')
})

// Make favico fuck off
router.get('/favico*', (req, res) => {})

router.get('/*', (req, res) => { // ALL OTHER ROUTES
  console.log('pages' + req.url)
  res.render('pages' + req.url)
})

module.exports = router
