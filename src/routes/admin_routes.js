const express = require("express")
const multer = require("multer")
const router = express.Router()
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")
const AdminServices = require("../services/AdminServices")

// Import Middleware
const {multerUpload: multerUpload, validateAdminLogin: validateAdminLogin} = require("../middlewares/AdminMiddleware")

router.use(cookieParser());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.use(express.json()); // to support JSON-encoded bodies                           these are for multer
router.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies         img uploads

// Loading static files (CSS,JS)
router.use(express.static('niche-site/public'))

// INVENTORY FULL VIEW
router.get('/inventory/$', validateAdminLogin, async (req, res) => {
  var inventory = await SiteServices.getFullInventory()
  res.render('pages/admin/inventory/inventory.ejs', {
    items: inventory,
  })
})

// NEW INVENTORY ITEM
router.get('/inventory/new_item', validateAdminLogin, async (req, res) => {
  var item = await AdminServices.newInventoryItem()
  res.redirect("/admin/inventory/edit_item/" + item._id)
})

// EDIT ITEM
router.get('/inventory/edit_item/:id', validateAdminLogin, async (req, res) => {
  var item = await SiteServices.getInventoryByID(req.params.id)
  res.render('pages/admin/inventory/edit_item.ejs', {
    item: item,
  })
})

// LOGIN
router.get('/login', async (req, res) => {
  res.render('pages/admin/login.ejs',{
    bad_login: false
  })
})
router.get('/bad_login', async (req, res) => {
  res.render('pages/admin/login.ejs',{
    bad_login: true
  })
})

// VIEW ALL USER SESSIONS
router.get('/sessions/main', validateAdminLogin, async (req, res) => {
  var sessions = await AdminServices.getAllUserSessions()
  res.render('pages/admin/sessions/sessions_main.ejs', {
    sessions: sessions,
  })
})

// VIEW ALL ORDERS
router.get('/orders/main', validateAdminLogin, async (req, res) => {
  var orders = await AdminServices.getAllOrders()
  res.render('pages/admin/orders/orders.ejs', {
    orders: orders,
  })
})

// INDEX PAGE (redirect)
router.get('/$', validateAdminLogin, async (req, res) => {
  res.redirect("/admin/inventory/")
})


// ================= POST ======================

router.post('/login', async (req, res) => {
  await AdminServices.login(req,res)
  /*
  console.log("LOGIN ATTEMPT")

  const username = req.body.username
  const password = req.body.password
  let auth = await AdminServices.checkLogin(username,password)
  if(auth == true){
    let cookie = ""+username+"|"+password
    res.cookie('admin_login', cookie, {
      maxAge: 31556926000,
      httpOnly: true,
    })
    res.redirect('/admin/inventory/')
    console.log("SUCCESS")
  }else{
    console.log("FAILURE")
    res.redirect('/admin/bad_login')
  }*/
})

router.post('/new_image/:id', multerUpload.single('image'), async (req, res) => {
  await AdminServices.addImageToItem(req.params.id, req.img_url)
  res.redirect('back')
})

router.post('/delete_image/:id/:img_num', async (req, res) => {
  console.log("DELETING IMAGE: "+req.url)
  await AdminServices.deleteImage(req.params.id, req.params.img_num)
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

router.post('/delete_order/:id', async (req, res) => {
  AdminServices.deleteOrder(req.params.id)
  res.redirect('back');
})

module.exports = router
