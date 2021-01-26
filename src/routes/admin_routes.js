const express = require("express")
const multer = require("multer")
const router = express.Router()

const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")
const AdminServices = require("../services/AdminServices")

// Import Middleware
const {multerUpload: multerUpload} = require("../middlewares/AdminMiddleware")

router.use(express.json()); // to support JSON-encoded bodies                           these are for multer
router.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies         img uploads

// Loading static files (CSS,JS)
router.use(express.static('rag-site/public'))

// INVENTORY FULL VIEW
router.get('/inventory/$', async (req, res) => {
  var inventory = await SiteServices.getFullInventory()
  res.render('pages/admin/inventory/inventory.ejs', {
    items: inventory,
  })
})

// NEW INVENTORY ITEM
router.get('/inventory/new_item', async (req, res) => {
  var item = await AdminServices.newInventoryItem()
  res.redirect("/admin/inventory/edit_item/" + item._id)
})

// EDIT ITEM
router.get('/inventory/edit_item/:id', async (req, res) => {
  var item = await SiteServices.getInventoryByID(req.params.id)
  res.render('pages/admin/inventory/edit_item.ejs', {
    item: item,
  })
})

// VIEW ALL USER SESSIONS
router.get('/sessions/main', async (req, res) => {
  var sessions = await AdminServices.getAllUserSessions()
  res.render('pages/admin/sessions/sessions_main.ejs', {
    sessions: sessions,
  })
})

// INDEX PAGE (redirect)
router.get('/$', async (req, res) => {
  res.redirect("/admin/inventory/")
})


// ================= POST ======================

// ADMIN LOGIN   WIP
router.post('/login', (req, res) => {
  console.log("ADMIN PASSWORD ATTEMPT")
  if (req.body.password == "booty") {
    console.log("   - Succesful")

    var hash = "hash"

    res.cookie('auth', hash, {
      maxAge: 31556926000,
      httpOnly: true
    })
    res.redirect('back')
  } else {
    res.redirect('back')
  }
})

router.post('/new_image/:id', multerUpload.single('image'), async (req, res) => {
  await AdminServices.addImageToItem(req.params.id, req.img_url)
  res.redirect('back')
})

router.post('/update_item/:id', async (req, res) => {
  await AdminServices.updateInventoryItem(req.params.id, req)
  res.redirect('/admin/inventory/')
})

router.post('/delete_item/:id', async (req, res) => {
  await AdminServices.deleteInventoryItem(req.params.id)
  res.redirect('/admin/inventory/')
})

router.post('/delete_session/:id', async (req, res) => {
  AdminServices.deleteUserSession(req.params.id)
  res.redirect('back');
})

module.exports = router
